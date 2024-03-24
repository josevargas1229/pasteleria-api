import jwt from 'jsonwebtoken';
//Middleware de autenticación para usuarios en general
export const verificarToken = (req, res, next) => {
  const token = req.headers.cookie.split('=')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const decodedToken = jwt.verify(token, 'secret');
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send(false);
  }
};
// Middleware de autenticación para usuarios normales
export const verificarTokenUsuario = (req, res, next) => {
  const token = req.headers.cookie.split('=')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  console.log(token)
  try {
    const decodedToken = jwt.verify(token, 'secreto');
    if (decodedToken.rol !== 'usuario') {
      return res.status(403).json({ message: 'Acceso no autorizado, sólo para usuarios' });
    }
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware de autenticación para administradores
export const verificarTokenAdmin = (req, res, next) => {
  const token = req.headers.cookie.split('=')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secreto');
    if (decodedToken.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso no autorizado, sólo para administradores' });
    }
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
