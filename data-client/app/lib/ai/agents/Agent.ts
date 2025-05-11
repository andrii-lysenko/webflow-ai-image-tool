import { AIImage } from "@/app/types";

export interface Agent {
  respond(query: string, images?: AIImage[]): Promise<any>;
}
