export class Bn2MeError extends Error {}

export class Bn2MeOAuthError extends Bn2MeError {
  constructor(
    public error: string,
    public error_description?: string,
    public error_uri?: string
  ) {
    super(
      `Received ${error}` +
      (error_description ? `: ${error_description}` : '') +
      (error_uri ? ` (${error_uri})` : '')
    );
  }
}
