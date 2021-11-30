// Actions
export class LoginApplication {
  static readonly type = '[Authentication] Login Application';
  constructor(
    public readonly username: string,
    public readonly password: string
  ) {}
}

export class LoginApplicationTest {
  static readonly type = '[Authentication] Login Application Test';
  constructor(public readonly username: string) {}
}

export class Logout {
  static readonly type = '[Authentication] Logout';
}

export class LogoutTest {
  static readonly type = '[Authentication] Logout Test';
}

// Mutation Actions
export class LoginSuccess {
  static readonly type = '[Authentication] Login Success';
  constructor(
    public readonly token: string,
    public readonly username: string
  ) {}
}

export class LoginCanceled {
  static readonly type = '[Authentication] Login Canceled';
}

/**visualizator domain login */
export class LoginApplicationDomain {
  static readonly type = '[Authentication] Login Application Domain';
  constructor(
    public readonly domain: string,
    public readonly username: string,
    public readonly password: string,
    public readonly plant: string
  ) {}
}

export class LogoutDomain {
  static readonly type = '[Authentication] Logout Domain';
}

// Mutation Actions
export class LoginSuccessDomain {
  static readonly type = '[Authentication] Login Success Domain';
  constructor(
    public readonly token: string,
    public readonly plant: string,
    public readonly username: string
  ) {}
}

export class LoginErrorDomain {
  static readonly type = '[Authentication] Login Error Domain';
}

export class LoginCanceledDomain {
  static readonly type = '[Authentication] Login Canceled Domain';
}

/**
 * Fetch possible plants - Visualizator only
 */
export class FetchPlants {
  static readonly type = '[Authentication] Fetch Plants';
}

/**
 * Login to Adfs - Orion only
 */
export class LoginAdfs {
  static readonly type = '[Authentication] Login Adfs';
}

export class LoginAdfsSuccess {
  static readonly type = '[Authentication] Login Adfs Success';
  constructor(public readonly username: string, public readonly upn: string, public readonly primarySid: string) {}
}

/**
 * Logout Adfs - Orion only
 */
export class LogoutAdfs {
  static readonly type = '[Authentication] Logout Adfs';
}

export class FetchAdfsPlants {
  static readonly type = '[Authentication] Fetch Adfs Plants';
}

export class SetActivePlant {
  static readonly type = '[Authentication] Set Active Plant';
  constructor(public readonly plant: string) {}
}
