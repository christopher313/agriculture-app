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
  }) {
    // Vérifie si l'email existe déjà
    if (this.users.find((u) => u.email === user.email)) {
      throw new Error("Email déjà utilisé");
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(user.password, 10);
    this.users.push({ ...user, password: hashedPassword });
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
