export interface Order {
  id: string;
  createdAt: string;
  status: string;
  substatus?: string;
  source?: string;
  agent?: string;
}
