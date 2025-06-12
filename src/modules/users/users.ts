import bcrypt from "bcrypt";

class UserManager {
  private users: Array<{
    id: string;
    name: string;
    email: string;
    password: string;
  }> = [];

  async addUser(user: {
    id: string;
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    // Vérifie le format de l'email (plus strict)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(user.email)) {
      return { success: false, message: "Format d'email invalide" };
    }
    // Vérifie si l'email existe déjà
    if (this.users.find((u) => u.email === user.email)) {
      return { success: false, message: "Email déjà utilisé" };
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(user.password, 10);
    this.users.push({ ...user, password: hashedPassword });
    return { success: true, message: "Utilisateur ajouté avec succès" };
  }

  getUsers() {
    return this.users;
  }

  findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async authenticate(email: string, password: string) {
    const user = this.findByEmail(email);
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  }
}

const userManager = new UserManager();

export default UserManager;
