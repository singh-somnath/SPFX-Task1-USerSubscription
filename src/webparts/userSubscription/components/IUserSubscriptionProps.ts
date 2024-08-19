import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUserSubscriptionProps {
  description: string;
  userDisplayName: string;
  currentContext:WebPartContext;
}
