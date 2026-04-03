<?php
require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Already logged in → go to dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $password === '') {
        $error = 'Veuillez remplir tous les champs.';
    } else {
        try {
            $pdo = getDB();
            $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ? LIMIT 1");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                // ✅ Login success
                session_regenerate_id(true);
                $_SESSION['user_id']  = $user['id'];
                $_SESSION['username'] = $user['username'];
                header('Location: index.php');
                exit;
            } else {
                $error = 'Nom d\'utilisateur ou mot de passe incorrect.';
            }
        } catch (Exception $e) {
            $error = 'Erreur de connexion à la base de données.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion - Plateforme Éducative</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%);
      position: relative;
      overflow: hidden;
    }
    .bg-shape {
      position: absolute; border-radius: 50%;
      background: rgba(255,255,255,0.05);
      animation: float 20s infinite ease-in-out;
    }
    .bg-shape:nth-child(1) { width:300px; height:300px; top:-100px; left:-100px; }
    .bg-shape:nth-child(2) { width:200px; height:200px; bottom:-50px; right:-50px; animation-delay:3s; }
    .bg-shape:nth-child(3) { width:150px; height:150px; top:50%; right:10%; animation-delay:6s; }
    @keyframes float {
      0%,100% { transform:translate(0,0) scale(1); opacity:.3; }
      50%      { transform:translate(30px,-30px) scale(1.1); opacity:.5; }
    }
    .grid-overlay {
      position:absolute; top:0; left:0; width:100%; height:100%;
      background-image: linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
                        linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
      background-size: 50px 50px;
    }
    .login-container {
      background: white; border-radius: 20px; padding: 50px 45px;
      width: 100%; max-width: 460px;
      box-shadow: 0 20px 60px rgba(0,0,0,.3);
      position: relative; z-index: 10;
      animation: slideUp .6s ease-out;
    }
    @keyframes slideUp {
      from { opacity:0; transform:translateY(40px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .header-section { text-align:center; margin-bottom:35px; }
    .logo {
      width:70px; height:70px; margin:0 auto 20px;
      background: linear-gradient(135deg,#1e3c72,#2a5298);
      border-radius:16px; display:flex; align-items:center; justify-content:center;
      font-size:32px; color:white; font-weight:bold;
      box-shadow: 0 4px 15px rgba(30,60,114,.3);
      animation: logoFloat 3s ease-in-out infinite;
    }
    @keyframes logoFloat {
      0%,100% { transform:translateY(0); }
      50%      { transform:translateY(-5px); }
    }
    .header-section h1 { color:#1e3c72; font-size:28px; font-weight:700; margin-bottom:8px; }
    .header-section p  { color:#6b7280; font-size:15px; line-height:1.5; }

    /* Error banner */
    .error-banner {
      background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;
      color: #b91c1c; padding: 12px 16px; font-size: 14px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
    }

    .input-group { position:relative; margin-bottom:25px; }
    .input-group label { display:block; color:#374151; font-size:14px; font-weight:600; margin-bottom:8px; }
    .input-icon { position:absolute; left:16px; top:43px; color:#9ca3af; font-size:18px; }
    .input-group input {
      width:100%; padding:14px 16px 14px 45px;
      background:#f9fafb; border:2px solid #e5e7eb; border-radius:10px;
      font-size:15px; color:#1f2937; transition:all .3s ease; outline:none;
    }
    .input-group input:focus {
      background:white; border-color:#2a5298;
      box-shadow: 0 0 0 3px rgba(42,82,152,.1);
    }
    .remember-forgot {
      display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;
    }
    .remember-me { display:flex; align-items:center; gap:8px; cursor:pointer; }
    .remember-me input[type="checkbox"] { width:18px; height:18px; accent-color:#2a5298; }
    .remember-me label { color:#4b5563; font-size:14px; }
    .login-btn {
      width:100%; padding:15px;
      background: linear-gradient(135deg,#1e3c72,#2a5298);
      color:white; border:none; border-radius:10px; cursor:pointer;
      font-size:16px; font-weight:600; transition:all .3s ease;
      box-shadow: 0 4px 12px rgba(30,60,114,.3);
    }
    .login-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(30,60,114,.4); }
    .login-btn:active { transform:translateY(0); }
    .footer-text { text-align:center; margin-top:25px; color:#6b7280; font-size:13px; }
    @media (max-width:480px) {
      .login-container { padding:35px 25px; }
      .header-section h1 { font-size:24px; }
      .bg-shape { display:none; }
      .remember-forgot { flex-direction:column; gap:12px; align-items:flex-start; }
    }
  </style>
</head>
<body>
  <div class="bg-shape"></div>
  <div class="bg-shape"></div>
  <div class="bg-shape"></div>
  <div class="grid-overlay"></div>

  <div class="login-container">
    <div class="header-section">
      <div class="logo">📚</div>
      <h1>Espace Enseignant</h1>
      <p>Bienvenue sur votre plateforme de gestion des étudiants et des emplois du temps</p>
    </div>

    <?php if ($error): ?>
      <div class="error-banner">⚠️ <?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <form method="POST" action="login.php">
      <div class="input-group">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" name="username"
               placeholder="Entrez votre nom d'utilisateur"
               value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>" required>
        <span class="input-icon">👤</span>
      </div>

      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="password"
               placeholder="Entrez votre mot de passe" required>
        <span class="input-icon">🔒</span>
      </div>

      <div class="remember-forgot">
        <div class="remember-me">
          <input type="checkbox" id="remember" name="remember">
          <label for="remember">Se souvenir de moi</label>
        </div>
      </div>

      <button type="submit" class="login-btn">Se connecter</button>
    </form>

    <div class="footer-text">© 2026 Plateforme Éducative — Tous droits réservés</div>
  </div>
</body>
</html>
