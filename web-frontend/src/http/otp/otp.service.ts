import { API } from "../config";

export type OtpPurpose = "VERIFY_EMAIL" | "CHANGE_PASSWORD";

export interface ValidateOtpInput {
  code: string;
  purpose: OtpPurpose;
}

export interface ValidateOtpResponse {
  message: string;
}

export const OtpService = {
  /**
   * Valida um código OTP
   * @param accessToken Token de autenticação do usuário
   * @param input Dados do OTP (código e propósito)
   * @returns Promise com a resposta da validação
   */
  async validate(
    accessToken: string,
    input: ValidateOtpInput
  ): Promise<ValidateOtpResponse | null> {
    const resp = await fetch(`${API.BASE_URL}/otp/validate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
    });

    if (!resp.ok) {
      const dataJson = await resp.json();
      console.error(`Erro ao validar OTP:`, dataJson);
      return null;
    }

    return await resp.json();
  },

  /**
   * Solicita o envio de um OTP para ativação de conta
   * @param accessToken Token de autenticação do usuário
   * @returns Promise com a resposta da solicitação
   */
  async requestAccountActivation(
    accessToken: string
  ): Promise<{ message: string } | null> {
    const resp = await fetch(
      `${API.BASE_URL}/auth/request-account-activation`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!resp.ok) {
      const dataJson = await resp.json();
      console.error(`Erro ao solicitar ativação de conta:`, dataJson);
      return null;
    }

    return await resp.json();
  },

  /**
   * Solicita o envio de um OTP para mudança de senha
   * @param accessToken Token de autenticação do usuário
   * @returns Promise com a resposta da solicitação
   */
  async requestPasswordChange(
    accessToken: string
  ): Promise<{ message: string } | null> {
    const resp = await fetch(`${API.BASE_URL}/auth/request-password-change`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!resp.ok) {
      const dataJson = await resp.json();
      console.error(`Erro ao solicitar mudança de senha:`, dataJson);
      return null;
    }

    return await resp.json();
  },

  /**
   * Ativa a conta do usuário usando um código OTP
   * @param accessToken Token de autenticação do usuário
   * @param code Código OTP de 6 dígitos
   * @returns Promise com a resposta da ativação
   */
  async activateAccount(
    accessToken: string,
    code: string
  ): Promise<ValidateOtpResponse | null> {
    return this.validate(accessToken, {
      code,
      purpose: "VERIFY_EMAIL",
    });
  },

  /**
   * Valida OTP para mudança de senha
   * @param accessToken Token de autenticação do usuário
   * @param code Código OTP de 6 dígitos
   * @returns Promise com a resposta da validação
   */
  async validatePasswordChange(
    accessToken: string,
    code: string
  ): Promise<ValidateOtpResponse | null> {
    return this.validate(accessToken, {
      code,
      purpose: "CHANGE_PASSWORD",
    });
  },
};
