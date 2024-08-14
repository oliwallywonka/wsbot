import { BaileysProvider } from "@bot-whatsapp/provider-baileys";
import axios from "axios";

interface ResponseAPI {
  data: DataAPI;
}

interface DataAPI {
  fullName: string;
  empID: string;
  telefono: string;
  jwt: string;
}

interface Data {
  fullName: string;
  empID: string;
  phone: string;
  linkURL: string;
}

export const enum TaskState {
  Started,
  Completed,
  Sending,
  Stopped,
  Failed,
}

export class WSTask {
  private static _instance: WSTask;
  private URL = "http://177.222.106.83:86/api/survey";

  public data: Data[] = [];
  public messageCount = 0;
  public state: TaskState = TaskState.Started;

  public static instance(): WSTask {
    if (!WSTask._instance) {
      WSTask._instance = new WSTask();
    }
    return WSTask._instance;
  }

  public async getData() {
    try {
      this.data = await axios
        .get(this.URL)
        .then(async (res) => (await res.data) as ResponseAPI[])
        .then((items) => {
          return items.map((item) => ({
            fullName: item.data.fullName,
            empID: item.data.empID,
            phone: `591${item.data.telefono}`,
            linkURL: `http://177.222.106.83:86/?token=/${item.data.jwt}`,
          }));
        });
    } catch (error) {
      throw error;
    }
  }

  public async sendMessages(
    bot: Pick<BaileysProvider, "sendMessage">,
    messageTemplate: string
  ) {
    if (this.state === TaskState.Stopped || this.state === TaskState.Failed) {
      await this.getData();
    }

    if (this.state === TaskState.Sending) {
      return this.state;
    }

    for (const data of this.data) {
      if (this.state === TaskState.Stopped || TaskState.Failed) {
        return this.state;
      }
      this.state = TaskState.Sending;
      await bot.sendMessage(data.phone, messageTemplate, {});
    }
    this.state = TaskState.Completed;
  }

  public async stopSending() {
    this.state = TaskState.Stopped;
  }
}

type TaskFunction<T> = () => Promise<T>;

interface QueueItem<T> {
  task: TaskFunction<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export class InMemoryQueue<T = any> {
  private queue: QueueItem<T>[] = [];
  private activeJob: QueueItem<T> | null = null;
  private processing = false;

  // Agregar tarea a la cola
  add(task: TaskFunction<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue().catch((err) =>
        console.error("Error processing queue:", err)
      );
    });
  }

  // Procesar la cola
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    this.activeJob = this.queue.shift() as QueueItem<T>;

    try {
      const result = await this.activeJob.task();
      this.activeJob.resolve(result);
    } catch (error) {
      this.activeJob.reject(error);
    } finally {
      this.activeJob = null;
      this.processing = false;
      if (this.queue.length > 0) {
        this.processQueue().catch((err) =>
          console.error("Error processing queue:", err)
        );
      }
    }
  }

  // Obtener el número de tareas activas
  getActiveCount(): number {
    return this.activeJob ? this.queue.length + 1 : 0;
  }

  // Obtener el número de tareas en espera
  getWaitingCount(): number {
    return this.queue.length;
  }

  // Detener la tarea activa (si es posible)
  stopActiveTask(): void {
    if (this.activeJob) {
      // Aquí podrías implementar una lógica para cancelar la tarea si es cancelable
      this.queue = [];
      this.activeJob = null;
      this.processing = false;
    }
  }
}
