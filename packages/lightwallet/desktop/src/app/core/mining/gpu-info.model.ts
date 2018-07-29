export class GPUInfo {
  id: number;
  title: string;
  total_memory: number;
  free_memory: number;
  value: boolean;
  temperature: number;
  gpu_util: number;
  memory_util: number;
  fan_speed: number;

  constructor(
    id: number,
    title: string,
    total_memory: number,
    temperature: number,
    gpu_util: number,
    memory_util: number,
    fan_speed: number
  ) {
    this.id = id;
    this.title = title;
    this.total_memory = total_memory;
    this.temperature = temperature;
    this.gpu_util = gpu_util;
    this.memory_util = memory_util;
    this.fan_speed = fan_speed;
  }
}
