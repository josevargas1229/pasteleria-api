export const generarCodigo = () => {
    const caracteres = '0123456789abcdefghijklmnopqrstuvwxyz';

    // Defino una variable vacia de tipo string 
    let otp = "";

    // Mediante for definimos que nuestro código sea de 6 caracteres
    // Usamos Math.floor y Math.random para generar valores aleatorios 
    for (let i = 6; i > 0; i--) {
        otp += caracteres[Math.floor(Math.random() * caracteres.length)];
    }

    // Retornamos el código de 6 digitos 
    return otp;
}