require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import CropManager from "./modules/crops/crops";
import LivestockManager from "./modules/livestock/livestock";
import EquipmentManager from "./modules/equipment/equipment";
import WeatherService from "./modules/weather/weather";
import FinanceManager from "./modules/finance/finance";
import UserManager from "./modules/users/users";

// Déclaration pour que TypeScript reconnaisse req.session.user
declare module "express-session" {
  interface SessionData {
    user?: { username: string };
    flash?: { module: string; message: string; values?: any };
  }
}

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Instanciation des gestionnaires (une seule fois)
const cropManager = new CropManager();
const livestockManager = new LivestockManager();
const equipmentManager = new EquipmentManager();
const weatherService = new WeatherService(process.env.WEATHER_API_KEY || "");
const userManager = new UserManager();
const financeManager = new FinanceManager();

// Middleware flash
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// Page d'accueil
app.get("/", (req: Request, res: Response) => {
  const user = req.session.user;
  res.send(`
    <html>
      <head>
        <title>Application Agricole</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f7fafc; margin: 0; padding: 0; }
          header { background: #388e3c; color: #fff; padding: 20px 0; text-align: center; }
          nav ul {
            list-style: none;
            padding: 0;
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
          }
          nav a { color: #388e3c; text-decoration: none; font-weight: bold; }
          main { max-width: 700px; margin: 30px auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px #0001; }
          h2 { color: #388e3c; }
          form { margin-bottom: 25px; }
          label { display: block; margin-bottom: 8px; }
          input { padding: 6px; margin-bottom: 12px; width: 100%; max-width: 300px; }
          button { background: #388e3c; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer; }
          button:hover { background: #256029; }
          .success-flash {
  color: #256029;
  background: #e8f5e9;
  border: 1.5px solid #388e3c;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 14px;
  font-size: 1em;
  display: inline-block;
}
        </style>
      </head>
      <body>
        <header>
          <h1>Bienvenue sur l'application agricole</h1>
        </header>
        <nav>
          <ul>
            <li><a href="/crops">Voir les cultures</a></li>
            <li><a href="/livestock">Voir les animaux</a></li>
            <li><a href="/equipment">Voir le matériel</a></li>
            <li><a href="/weather">Voir la météo</a></li>
            <li><a href="/finance">Voir la finance</a></li>
            ${user ? '<li><a href="/logout">Déconnexion</a></li>' : ""}
          </ul>
        </nav>
        <main>
          ${
            user
              ? `
          <p>Connecté en tant que <b>${user.username}</b></p>
          <section>
            <h2>Ajouter un animal</h2>
            ${
              res.locals.flash && res.locals.flash.module === "livestock"
                ? `<div class="success-flash">
            <span style="font-size:1.1em;vertical-align:middle;">&#10003;</span>
            <span style="font-weight:500;">${res.locals.flash.message}</span>
          </div>`
                : ""
            }
            <form method="POST" action="/livestock">
              <label>Type: <input name="type" required value="${
                res.locals.flash &&
                res.locals.flash.module === "livestock" &&
                res.locals.flash.values
                  ? res.locals.flash.values.type
                  : ""
              }" /></label>
              <label>Nom: <input name="name" required value="${
                res.locals.flash &&
                res.locals.flash.module === "livestock" &&
                res.locals.flash.values
                  ? res.locals.flash.values.name
                  : ""
              }" /></label>
              <button type="submit">Ajouter</button>
            </form>
          </section>
          <section>
            <h2>Ajouter une culture</h2>
            ${
              res.locals.flash && res.locals.flash.module === "crops"
                ? `<div class="success-flash">
            <span style="font-size:1.1em;vertical-align:middle;">&#10003;</span>
            <span style="font-weight:500;">${res.locals.flash.message}</span>
          </div>`
                : ""
            }
            <form method="POST" action="/crops">
              <label>Nom: <input name="name" required value="${
                res.locals.flash &&
                res.locals.flash.module === "crops" &&
                res.locals.flash.values
                  ? res.locals.flash.values.name
                  : ""
              }" /></label>
              <label>Type: <input name="type" required value="${
                res.locals.flash &&
                res.locals.flash.module === "crops" &&
                res.locals.flash.values
                  ? res.locals.flash.values.type
                  : ""
              }" /></label>
              <button type="submit">Ajouter</button>
            </form>
          </section>
          <section>
            <h2>Ajouter un équipement</h2>
            ${
              res.locals.flash && res.locals.flash.module === "equipment"
                ? `<div class="success-flash">
            <span style="font-size:1.1em;vertical-align:middle;">&#10003;</span>
            <span style="font-weight:500;">${res.locals.flash.message}</span>
          </div>`
                : ""
            }
            <form method="POST" action="/equipment">
              <label>Nom: <input name="name" required value="${
                res.locals.flash &&
                res.locals.flash.module === "equipment" &&
                res.locals.flash.values
                  ? res.locals.flash.values.name
                  : ""
              }" /></label>
              <label>Type: <input name="type" required value="${
                res.locals.flash &&
                res.locals.flash.module === "equipment" &&
                res.locals.flash.values
                  ? res.locals.flash.values.type
                  : ""
              }" /></label>
              <button type="submit">Ajouter</button>
            </form>
          </section>
          <section>
  <h2>Ajouter une opération financière</h2>
  ${
    res.locals.flash && res.locals.flash.module === "finance"
      ? `<div class="success-flash">
          <span style="font-size:1.1em;vertical-align:middle;">&#10003;</span>
          <span style="font-weight:500;">${res.locals.flash.message}</span>
        </div>`
      : ""
  }
  <form method="POST" action="/finance">
    <label>Type: 
      <input name="type" required value="${
        res.locals.flash &&
        res.locals.flash.module === "finance" &&
        res.locals.flash.values
          ? res.locals.flash.values.type
          : ""
      }" />
    </label>
    <label>Montant: 
      <input name="amount" type="number" step="0.01" required value="${
        res.locals.flash &&
        res.locals.flash.module === "finance" &&
        res.locals.flash.values
          ? res.locals.flash.values.amount
          : ""
      }" />
    </label>
    <button type="submit">Ajouter</button>
  </form>
</section>
          `
              : `
          <section>
            <div class="container">
              <h2 style="color:#388e3c;text-align:center;margin-bottom:28px;font-size:1.6em;letter-spacing:1px;">Connexion</h2>
              <form method="POST" action="/login" style="display:flex;flex-direction:column;gap:18px;">
                <div class="form-group" style="display:flex;flex-direction:column;align-items:stretch;">
                  <label for="email" style="font-weight:500;margin-bottom:6px;">Email</label>
                  <input id="email" name="email" type="email" required autocomplete="email"
                    style="padding:8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;" />
                </div>
                <div class="form-group" style="display:flex;flex-direction:column;align-items:stretch;">
  <label for="password" style="font-weight:500;margin-bottom:6px;">Mot de passe</label>
  <div style="display:flex;align-items:center;gap:6px;">
    <input id="password" name="password" type="password" required autocomplete="current-password"
      style="padding:8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;width:100%;" />
    <span class="toggle-password" id="eye-login" onclick="togglePassword('password','eye-login')"
      style="cursor:pointer;width:22px;height:22px;opacity:0.7;display:flex;align-items:center;"></span>
  </div>
</div>
                <button type="submit" style="background:#388e3c;color:#fff;border:none;padding:10px 0;border-radius:5px;font-size:1.1em;font-weight:bold;cursor:pointer;margin-top:10px;transition:background 0.2s;">Se connecter</button>
              </form>
              <a class="back-link" href="/register" style="display:block;text-align:center;margin-top:22px;color:#388e3c;text-decoration:none;font-size:0.98em;">Créer un compte</a>
            </div>
            <script>
              function togglePassword(id, iconId) {
                const input = document.getElementById(id);
                const icon = document.getElementById(iconId);
                if (input.type === "password") {
                  input.type = "text";
                  icon.innerHTML = eyeOpen;
                } else {
                  input.type = "password";
                  icon.innerHTML = eyeClosed;
                }
              }
              const eyeOpen = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>';
              const eyeClosed = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12s4-5 9-5 9 5 9 5-4 5-9 5-9-5-9-5z"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
              window.addEventListener('DOMContentLoaded', () => {
                document.getElementById('eye-login').innerHTML = eyeClosed;
              });
            </script>
          </section>
          `
          }
        </main>
      </body>
    </html>
  `);
});

// Page d'inscription
app.get("/register", (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>Inscription</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f7fafc; margin: 0; }
          .container {
            max-width: 370px;
            margin: 60px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 16px #0002;
            padding: 36px 32px 28px 32px;
          }
          h2 {
            color: #388e3c;
            text-align: center;
            margin-bottom: 28px;
            font-size: 1.6em;
            letter-spacing: 1px;
          }
          form { display: flex; flex-direction: column; gap: 18px; }
          .form-group { display: flex; flex-direction: column; align-items: stretch; position: relative; }
          label { font-weight: 500; margin-bottom: 6px; }
          input {
            padding: 8px 38px 8px 10px;
            border: 1px solid #cfd8dc;
            border-radius: 5px;
            font-size: 1em;
            background: #f7fafc;
            transition: border 0.2s;
          }
          input:focus { border: 1.5px solid #388e3c; outline: none; }
          .toggle-password {
            position: absolute;
            right: 10px;
            top: 34px;
            cursor: pointer;
            width: 22px;
            height: 22px;
            opacity: 0.7;
          }
          .toggle-password:hover { opacity: 1; }
          .error { color: #c0392b; font-size: 0.97em; margin-bottom: -10px; text-align: center; }
          .error-email {
  color: #c0392b;
  font-size: 1em;
  margin-bottom: 8px;
  margin-top: 2px;
  background: #ffeaea;
  border-radius: 4px;
  padding: 5px 10px;
  display: inline-block;
  font-family: inherit;
}
          button {
            background: #388e3c;
            color: #fff;
            border: none;
            padding: 10px 0;
            border-radius: 5px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.2s;
          }
          button:hover { background: #256029; }
          .back-link {
            display: block;
            text-align: center;
            margin-top: 22px;
            color: #388e3c;
            text-decoration: none;
            font-size: 0.98em;
          }
          .back-link:hover { text-decoration: underline; }
        </style>
        <script>
          function validateForm(e) {
            const pwd = document.getElementById('password').value;
            const confirm = document.getElementById('confirm').value;
            const pwdError = document.getElementById('password-error');
            if (pwd !== confirm) {
              pwdError.style.display = "inline-block";
              e.preventDefault();
              return false;
            }
            pwdError.style.display = "none";
            return true;
          }
          function togglePassword(id, iconId) {
            const input = document.getElementById(id);
            const icon = document.getElementById(iconId);
            if (input.type === "password") {
              input.type = "text";
              icon.innerHTML = eyeOpen;
            } else {
              input.type = "password";
              icon.innerHTML = eyeClosed;
            }
          }
          const eyeOpen = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>';
          const eyeClosed = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12s4-5 9-5 9 5 9 5-4 5-9 5-9-5-9-5z"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
          window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('eye-password').innerHTML = eyeClosed;
            document.getElementById('eye-confirm').innerHTML = eyeClosed;
          });
        </script>
      </head>
      <body>
        <div class="container">
          <h2>Créer un compte</h2>
          <form method="POST" action="/users" onsubmit="return validateForm(event)">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input id="username" name="username" required autocomplete="username" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div style="position:relative;display:flex;align-items:center;">
                <input id="password" name="password" type="password" required autocomplete="new-password"
                  style="padding:8px 38px 8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;width:100%;" />
                <span class="toggle-password" id="eye-password" onclick="togglePassword('password','eye-password')"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;width:22px;height:22px;opacity:0.7;"></span>
              </div>
            </div>
            <div class="form-group">
              <label for="confirm">Confirmer le mot de passe</label>
              <div style="position:relative;display:flex;align-items:center;">
                <input id="confirm" name="confirm" type="password" required autocomplete="new-password"
                  style="padding:8px 38px 8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;width:100%;" />
                <span class="toggle-password" id="eye-confirm" onclick="togglePassword('confirm','eye-confirm')"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;width:22px;height:22px;opacity:0.7;"></span>
              </div>
              <div id="password-error" class="error-email" style="display:none;">
  <span style="font-size:1.1em;vertical-align:middle;">&#9888;</span>
  <span style="font-weight:500;">Les mots de passe ne correspondent pas.</span>
</div>
            </div>
            <div id="error-msg" class="error"></div>
            <button type="submit">S'inscrire</button>
          </form>
          <a class="back-link" href="/">&#8592; Retour à l'accueil</a>
        </div>
      </body>
    </html>
  `);
});

// Liste des cultures (protégée)
app.get("/crops", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const crops = cropManager.getCrops ? cropManager.getCrops() : [];
  res.send(`
    <html>
      <head>
        <title>Liste des cultures</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f7fafc; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 30px; }
          h2 { color: #388e3c; text-align: center; }
          ul { padding: 0; }
          li { margin-bottom: 10px; }
          .back { display: block; margin: 20px auto 0; text-align: center; color: #388e3c; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Liste des cultures</h2>
          <ul>
            ${
              crops.length
                ? crops
                    .map(
                      (c: any) =>
                        `<li>${c.name} (${c.type || c.variety || ""})</li>`
                    )
                    .join("")
                : "<li>Aucune culture enregistrée.</li>"
            }
          </ul>
          <a class="back" href="/">&#8592; Retour à l'accueil</a>
        </div>
      </body>
    </html>
  `);
});

// Liste des animaux (protégée)
app.get("/livestock", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const animals = livestockManager.getLivestock();
  res.send(`
    <html>
      <head>
        <title>Liste des animaux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f7fafc; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 30px; }
          h2 { color: #388e3c; text-align: center; }
          ul { padding: 0; }
          li { margin-bottom: 10px; }
          .back { display: block; margin: 20px auto 0; text-align: center; color: #388e3c; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Liste des animaux</h2>
          <ul>
            ${
              animals.length
                ? animals
                    .map((a: any) => `<li>${a.type} : ${a.name}</li>`)
                    .join("")
                : "<li>Aucun animal enregistré.</li>"
            }
          </ul>
          <a class="back" href="/">&#8592; Retour à l'accueil</a>
        </div>
      </body>
    </html>
  `);
});

// Liste du matériel (protégée)
app.get("/equipment", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const equipment: any[] = equipmentManager.getAllEquipment
    ? equipmentManager.getAllEquipment()
    : [];
  res.send(`
    <html>
      <head>
        <title>Liste du matériel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f7fafc; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 30px; }
          h2 { color: #388e3c; text-align: center; }
          ul { padding: 0; }
          li { margin-bottom: 10px; }
          .back { display: block; margin: 20px auto 0; text-align: center; color: #388e3c; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Liste du matériel</h2>
          <ul>
            ${
              equipment.length
                ? equipment
                    .map((e: any) => `<li>${e.name} (${e.type})</li>`)
                    .join("")
                : "<li>Aucun matériel enregistré.</li>"
            }
          </ul>
          <a class="back" href="/">&#8592; Retour à l'accueil</a>
        </div>
      </body>
    </html>
  `);
});

// Page météo
app.get("/weather", async (req: Request, res: Response) => {
  try {
    const data = await weatherService.getWeatherForecast("Strasbourg");
    res.send(`
      <html>
        <head>
          <title>Météo - Strasbourg</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; background: #f7fafc; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 30px; }
            h1 { color: #388e3c; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { padding: 8px 4px; border-bottom: 1px solid #eee; }
            tr:last-child td { border-bottom: none; }
            .label { color: #388e3c; font-weight: bold; width: 40%; }
            .value { color: #222; }
            .back { display: block; margin: 20px auto 0; text-align: center; color: #388e3c; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Météo à ${data.city} (${data.country})</h1>
            <table>
              <tr><td class="label">Température</td><td class="value">${
                data.temperature
              } °C</td></tr>
              <tr><td class="label">Ressenti</td><td class="value">${
                data.feels_like
              } °C</td></tr>
              <tr><td class="label">Min / Max</td><td class="value">${
                data.temp_min
              } / ${data.temp_max} °C</td></tr>
              <tr><td class="label">Humidité</td><td class="value">${
                data.humidity
              } %</td></tr>
              <tr><td class="label">Pression</td><td class="value">${
                data.pressure
              } hPa</td></tr>
              <tr><td class="label">Ciel</td><td class="value">${
                data.weather
              } (${data.description})</td></tr>
              <tr><td class="label">Vent</td><td class="value">${
                data.wind_speed
              } m/s (${data.wind_deg}°)</td></tr>
              <tr><td class="label">Nuages</td><td class="value">${
                data.clouds
              } %</td></tr>
              <tr><td class="label">Lever du soleil</td><td class="value">${new Date(
                data.sunrise * 1000
              ).toLocaleTimeString()}</td></tr>
              <tr><td class="label">Coucher du soleil</td><td class="value">${new Date(
                data.sunset * 1000
              ).toLocaleTimeString()}</td></tr>
              <tr><td class="label">Date</td><td class="value">${new Date(
                data.date
              ).toLocaleString()}</td></tr>
            </table>
            <a class="back" href="/">&#8592; Retour à l'accueil</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de la météo");
  }
});

// Ajout d'un animal
app.post("/livestock", (req: Request, res: Response) => {
  const { type, name } = req.body;
  if (!type || !name) {
    req.session.flash = {
      module: "livestock",
      message: "Veuillez remplir tous les champs.",
      values: { type, name },
    };
    return res.redirect("/");
  }
  const animal = {
    id: Date.now().toString(),
    type,
    name,
  };
  livestockManager.addLivestock(animal);
  req.session.flash = {
    module: "livestock",
    message: "Animal ajouté avec succès !",
  };
  res.redirect("/");
});

app.post("/equipment", (req: Request, res: Response) => {
  const { name, type } = req.body;
  if (!name || !type) {
    // Affiche le formulaire avec les valeurs déjà saisies et un message d'erreur
    req.session.flash = {
      module: "equipment",
      message: "Veuillez remplir tous les champs.",
      values: { name, type },
    };
    return res.redirect("/");
  }
  // ...ajout normal...
  const equipment = {
    id: Date.now().toString(),
    name,
    type,
    status: "available" as const,
    usageHours: 0,
    maintenanceSchedule: [] as Date[],
  };
  equipmentManager.addEquipment(equipment);
  req.session.flash = {
    module: "equipment",
    message: "Équipement ajouté avec succès !",
  };
  res.redirect("/");
});

app.post("/crops", (req: Request, res: Response) => {
  const { name, type } = req.body;
  if (!name || !type) {
    req.session.flash = {
      module: "crops",
      message: "Veuillez remplir tous les champs.",
      values: { name, type },
    };
    return res.redirect("/");
  }
  const crop = {
    id: Date.now(),
    name: name as string,
    type: type as string,
    variety: "", // valeur par défaut, à adapter selon votre logique
    area: 0, // valeur par défaut, à adapter selon votre logique
    yield: 0, // valeur par défaut, à adapter selon votre logique
  };
  cropManager.addCrop(crop);
  req.session.flash = {
    module: "crops",
    message: "Culture ajoutée avec succès !",
  };
  res.redirect("/");
});

// Création d'un utilisateur
app.post("/users", (req: Request, res: Response) => {
  (async () => {
    const { username, email, password } = req.body;
    const user = {
      id: Date.now().toString(),
      name: username,
      email: email,
      password: password,
    };

    const result = await userManager.addUser(user);

    if (!result.success) {
      // Affiche la page d'inscription avec le message d'erreur sous le champ email
      return res.send(`
        <html>
          <head>
            <title>Inscription</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; background: #f7fafc; margin: 0; }
              .container {
                max-width: 370px;
                margin: 60px auto;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 16px #0002;
                padding: 36px 32px 28px 32px;
              }
              h2 {
                color: #388e3c;
                text-align: center;
                margin-bottom: 28px;
                font-size: 1.6em;
                letter-spacing: 1px;
              }
              form { display: flex; flex-direction: column; gap: 18px; }
              .form-group { display: flex; flex-direction: column; align-items: stretch; position: relative; }
              label { font-weight: 500; margin-bottom: 6px; }
              input {
                padding: 8px 38px 8px 10px;
                border: 1px solid #cfd8dc;
                border-radius: 5px;
                font-size: 1em;
                background: #f7fafc;
                transition: border 0.2s;
              }
              input:focus { border: 1.5px solid #388e3c; outline: none; }
              .toggle-password {
                position: absolute;
                right: 10px;
                top: 34px;
                cursor: pointer;
                width: 22px;
                height: 22px;
                opacity: 0.7;
              }
              .toggle-password:hover { opacity: 1; }
              .error { color: #c0392b; font-size: 0.97em; margin-bottom: -10px; text-align: center; }
              .error-email {
  color: #c0392b;
  font-size: 1em;
  margin-bottom: 8px;
  margin-top: 2px;
  background: #ffeaea;
  border-radius: 4px;
  padding: 5px 10px;
  display: inline-block;
  font-family: inherit;
}
              button {
                background: #388e3c;
                color: #fff;
                border: none;
                padding: 10px 0;
                border-radius: 5px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                margin-top: 10px;
                transition: background 0.2s;
              }
              button:hover { background: #256029; }
              .back-link {
                display: block;
                text-align: center;
                margin-top: 22px;
                color: #388e3c;
                text-decoration: none;
                font-size: 0.98em;
              }
              .back-link:hover { text-decoration: underline; }
            </style>
            <script>
              function validateForm(e) {
                const pwd = document.getElementById('password').value;
                const confirm = document.getElementById('confirm').value;
                const pwdError = document.getElementById('password-error');
                if (pwd !== confirm) {
                  pwdError.style.display = "inline-block";
                  e.preventDefault();
                  return false;
                }
                pwdError.style.display = "none";
                return true;
              }
              function togglePassword(id, iconId) {
                const input = document.getElementById(id);
                const icon = document.getElementById(iconId);
                if (input.type === "password") {
                  input.type = "text";
                  icon.innerHTML = eyeOpen;
                } else {
                  input.type = "password";
                  icon.innerHTML = eyeClosed;
                }
              }
              const eyeOpen = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>';
              const eyeClosed = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12s4-5 9-5 9 5 9 5-4 5-9 5-9-5-9-5z"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
              window.addEventListener('DOMContentLoaded', () => {
                document.getElementById('eye-password').innerHTML = eyeClosed;
                document.getElementById('eye-confirm').innerHTML = eyeClosed;
              });
            </script>
          </head>
          <body>
            <div class="container">
              <h2>Créer un compte</h2>
              <form method="POST" action="/users" onsubmit="return validateForm(event)">
                <div class="form-group">
                  <label for="username">Nom d'utilisateur</label>
                  <input id="username" name="username" required autocomplete="username" value="${username}" />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input id="email" name="email" type="email" required autocomplete="email" value="${email}" />
                  <div class="error-email">
                    <span style="font-size:1.1em;vertical-align:middle;">&#9888;</span>
                    <span style="font-weight:500;">Format d'email invalide</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="password">Mot de passe</label>
                  <div style="position:relative;display:flex;align-items:center;">
                    <input id="password" name="password" type="password" required autocomplete="new-password"
                      style="padding:8px 38px 8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;width:100%;" />
                    <span class="toggle-password" id="eye-password" onclick="togglePassword('password','eye-password')"
                      style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;width:22px;height:22px;opacity:0.7;"></span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="confirm">Confirmer le mot de passe</label>
                  <div style="position:relative;display:flex;align-items:center;">
                    <input id="confirm" name="confirm" type="password" required autocomplete="new-password"
                      style="padding:8px 38px 8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;width:100%;" />
                    <span class="toggle-password" id="eye-confirm" onclick="togglePassword('confirm','eye-confirm')"
                      style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;width:22px;height:22px;opacity:0.7;"></span>
                  </div>
                  <div id="password-error" class="error-email" style="display:none;">
  <span style="font-size:1.1em;vertical-align:middle;">&#9888;</span>
  <span style="font-weight:500;">Les mots de passe ne correspondent pas.</span>
</div>
                </div>
                <div id="error-msg" class="error"></div>
                <button type="submit">S'inscrire</button>
              </form>
              <a class="back-link" href="/">&#8592; Retour à l'accueil</a>
            </div>
          </body>
        </html>
      `);
    }

    // Si tout va bien, redirige vers l'accueil
    res.redirect("/");
  })();
});

// Connexion utilisateur
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = userManager.findByEmail(email);
  if (user && (await userManager.authenticate(email, password))) {
    req.session.user = { username: user.name };
    res.redirect("/");
  } else {
    // Affiche le formulaire avec le message d'erreur sous le formulaire
    res.send(`
      <html>
        <head>
          <title>Connexion</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; background: #f7fafc; margin: 0; }
            .container {
              max-width: 370px;
              margin: 60px auto;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 16px #0002;
              padding: 36px 32px 28px 32px;
            }
            h2 {
              color: #388e3c;
              text-align: center;
              margin-bottom: 28px;
              font-size: 1.6em;
              letter-spacing: 1px;
            }
            form { display: flex; flex-direction: column; gap: 18px; }
            .form-group { display: flex; flex-direction: column; align-items: stretch; position: relative; }
            label { font-weight: 500; margin-bottom: 6px; }
            input {
              padding: 8px 10px;
              border: 1px solid #cfd8dc;
              border-radius: 5px;
              font-size: 1em;
              background: #f7fafc;
              transition: border 0.2s;
            }
            input:focus { border: 1.5px solid #388e3c; outline: none; }
            .toggle-password {
              position: absolute;
              right: 10px;
              top: 34px;
              cursor: pointer;
              width: 22px;
              height: 22px;
              opacity: 0.7;
            }
            .toggle-password:hover { opacity: 1; }
            .error-login {
              color: #c0392b;
              font-size: 1em;
              margin-bottom: 8px;
              margin-top: 2px;
              background: #ffeaea;
              border-radius: 4px;
              padding: 5px 10px;
              display: inline-block;
              font-family: inherit;
              text-align: center;
            }
            button {
              background: #388e3c;
              color: #fff;
              border: none;
              padding: 10px 0;
              border-radius: 5px;
              font-size: 1.1em;
              font-weight: bold;
              cursor: pointer;
              margin-top: 10px;
              transition: background 0.2s;
            }
            button:hover { background: #256029; }
            .back-link {
              display: block;
              text-align: center;
              margin-top: 22px;
              color: #388e3c;
              text-decoration: none;
              font-size: 0.98em;
            }
            .back-link:hover { text-decoration: underline; }
          </style>
          <script>
            function togglePassword(id, iconId) {
              const input = document.getElementById(id);
              const icon = document.getElementById(iconId);
              if (input.type === "password") {
                input.type = "text";
                icon.innerHTML = eyeOpen;
              } else {
                input.type = "password";
                icon.innerHTML = eyeClosed;
              }
            }
            const eyeOpen = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>';
            const eyeClosed = '<svg fill="none" stroke="#388e3c" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12s4-5 9-5 9 5 9 5-4 5-9 5-9-5-9-5z"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
            window.addEventListener('DOMContentLoaded', () => {
              document.getElementById('eye-login').innerHTML = eyeClosed;
            });
          </script>
        </head>
        <body>
          <div class="container">
            <h2>Connexion</h2>
            <form method="POST" action="/login" style="display:flex;flex-direction:column;gap:18px;">
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" name="email" type="email" required autocomplete="email" />
              </div>
              <div class="form-group">
                <label for="password">Mot de passe</label>
                <div style="display:flex;align-items:center;gap:6px;">
                  <input id="password" name="password" type="password" required autocomplete="current-password"
                    style="padding:8px 10px;border:1px solid #cfd8dc;border-radius:5px;font-size:1em;background:#f7fafc;transition:border 0.2s;width:100%;" />
                  <span class="toggle-password" id="eye-login" onclick="togglePassword('password','eye-login')"
                    style="cursor:pointer;width:22px;height:22px;opacity:0.7;display:flex;align-items:center;"></span>
                </div>
              </div>
              <div class="error-login">
                <span style="font-size:1.1em;vertical-align:middle;">&#9888;</span>
                Identifiant ou mot de passe invalide.
              </div>
              <button type="submit">Se connecter</button>
            </form>
            <a class="back-link" href="/register">&#8592; Créer un compte</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Déconnexion utilisateur
app.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Données financières
app.get("/finance", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const data = financeManager.getFinancialData();
  res.send(`
    <html>
      <head>
        <title>Données financières</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; background: #f7fafc; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 30px; }
          h2 { color: #388e3c; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td { padding: 8px 4px; border-bottom: 1px solid #eee; }
          tr:last-child td { border-bottom: none; }
          .label { color: #388e3c; font-weight: bold; width: 40%; }
          .value { color: #222; }
          .back { display: block; margin: 20px auto 0; text-align: center; color: #388e3c; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Données financières</h2>
          <table>
            <tr><td class="label">Revenus</td><td class="value">${
              data.revenue
            } €</td></tr>
            <tr><td class="label">Dépenses</td><td class="value">${
              data.expenses
            } €</td></tr>
            <tr><td class="label">Bénéfice</td><td class="value">${
              data.profit
            } €</td></tr>
            <tr><td class="label">Coût de production</td><td class="value">${
              data.productionCost
            } €</td></tr>
            <tr><td class="label">Prix de vente</td><td class="value">${
              data.salePrice
            } €</td></tr>
            <tr><td class="label">Marge brute</td><td class="value">${
              data.grossMargin
            } €</td></tr>
            <tr><td class="label">Marge nette</td><td class="value">${
              data.netMargin
            } €</td></tr>
            <tr><td class="label">Date</td><td class="value">${new Date(
              data.date
            ).toLocaleString()}</td></tr>
          </table>
          <a class="back" href="/">&#8592; Retour à l'accueil</a>
        </div>
      </body>
    </html>
  `);
});

// Ajout d'une opération financière
app.post("/finance", (req: Request, res: Response) => {
  const { type, amount } = req.body;
  if (!type || !amount || isNaN(Number(amount))) {
    req.session.flash = {
      module: "finance",
      message: "Veuillez remplir tous les champs correctement.",
      values: { type, amount },
    };
    return res.redirect("/");
  }
  const record = {
    id: Date.now().toString(),
    type,
    amount: Number(amount),
  };
  financeManager.addRecord(record);
  req.session.flash = {
    module: "finance",
    message: "Opération financière ajoutée avec succès !",
  };
  res.redirect("/");
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
