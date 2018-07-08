export class GPUInfo {
  id: number;
  title: string;
  total_memory: number;
  free_memory: number;
  value: boolean;

  constructor(
    id: number,
    title: string,
    total_memory: number
  ) {
    this.id = id;
    this.title = title;
    this.total_memory = total_memory;
  }
}
