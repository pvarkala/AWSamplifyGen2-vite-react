// Temporarily disabled due to AWS Amplify import issues
// This file will be re-enabled once AWS Amplify dependencies are fixed

export class AWSAuthService {
  static async signInWithGoogle() {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async signInWithGitHub() {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async signInWithMicrosoft() {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async signIn(_email: string, _password: string) {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async signUp(_email: string, _password: string, _attributes: any) {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async signOut() {
    console.log('AWS Auth temporarily disabled')
  }

  static async getCurrentUser() {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async forgotPassword(_email: string) {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async forgotPasswordSubmit(_email: string, _code: string, _newPassword: string) {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async changePassword(_oldPassword: string, _newPassword: string) {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static async updateUserAttributes(_attributes: any) {
    console.log('AWS Auth temporarily disabled')
    throw new Error('AWS Auth temporarily disabled')
  }

  static onAuthStateChange(_callback: (authState: any) => void) {
    console.log('AWS Auth temporarily disabled')
  }
}

export default AWSAuthService
