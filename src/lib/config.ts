
export interface SchoolConfig {
    name: string;
    email: string;
    phone: string;
    address: string;
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
    }
}

// Esto actuaría como nuestra "base de datos" o fuente de verdad por ahora.
// En una aplicación real, estos datos se obtendrían de una API y se gestionarían con estado global (Context, Redux, etc.).
export const initialConfig: SchoolConfig = {
    name: "Sofía Educa",
    email: "contacto@sofiaeduca.edu.pe",
    phone: "+51 1 234 5678",
    address: "Av. La Educación 123, Lima, Perú",
    social: {
        facebook: "https://facebook.com/sofiaeduca",
        twitter: "https://x.com/sofiaeduca",
        instagram: "https://instagram.com/sofiaeduca",
    }
};
