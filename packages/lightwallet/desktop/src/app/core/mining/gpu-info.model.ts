export interface IGPUInfo {
  id: number;
  title: string;
  total_memory: number;
  free_memory: number;
  value: boolean;
  temperature: number;
  gpu_util: number;
  memory_util: number;
  fan_speed: number;
}
