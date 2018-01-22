export class SendMethod {

  public static TYPE_EASY = 'easy';
  public static TYPE_CLASSIC = 'classic';

  public static DESTINATION_SMS = 'sms';
  public static DESTINATION_EMAIL = 'email';
  public static DESTINATION_ADDRESS = 'address';

  public type:string;
  public destination:string;
  public value:string;

  constructor(opts) {
    this.type = opts.type;
    this.destination = opts.destination;
    this.value = opts.value;
  }

}