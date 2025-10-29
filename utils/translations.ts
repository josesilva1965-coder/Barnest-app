// New file: utils/translations.ts

import type { AppSettings } from '../types';

// FIX: Made the translations type recursive to allow for nested objects.
// This resolves all the type errors in this file.
type TranslationValue = string | ((params: Record<string, string | number>) => string);

interface TranslationNode {
    [key: string]: TranslationValue | TranslationNode;
}

type Translations = {
  [key in AppSettings['language']]: TranslationNode;
};

export const translations: Translations = {
  en: {
    sidebar: {
      pos: 'POS',
      kds: 'KDS',
      inventory: 'Inventory',
      tables: 'Tables',
      reservations: 'Reservations',
      reports: 'Reports',
      staff: 'Staff',
      feedback: 'Feedback',
      settings: 'Settings',
      install: 'Install App',
      logout: 'Logout',
    },
    login: {
      selectProfile: 'Select your profile to sign in',
      password: 'Password',
      enterPassword: 'Enter Password',
      login: 'Login',
      incorrectPassword: 'Incorrect password. Please try again.',
      notUser: (params) => `Not ${params.name}? Select a different profile.`,
      customerReservation: 'Are you a customer? Make a Reservation',
    },
    settings: {
        title: 'Application Settings',
        general: {
            title: 'General Configuration',
            taxRateLabel: 'Sales Tax Rate',
            taxRateDescription: 'This rate will be applied to all checks at the point of sale.',
        },
        appearance: {
            title: 'Appearance & Language',
            themeLabel: 'Theme',
            dark: 'Dark',
            light: 'Light',
            themeDescription: 'Change the color scheme of the application.',
            languageLabel: 'Language',
            languageDescription: 'Select the display language for the interface.',
        },
        saved: 'Saved',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
        url: {
            title: 'Public URL / QR Code Settings',
            label: 'Base URL',
            warningTitle: 'This is a critical setting for customer-facing features.',
            warningDescription1: 'After deploying your application to a public web address (e.g., <code>https://my-barnest-app.com</code>), you must enter that full address here. This ensures that the QR codes generated for table ordering point to the correct, live application.',
            warningDescription2: 'Please do not include a trailing slash (e.g., /) at the end of the URL.',
        },
        menu: {
            title: 'Menu Management',
            addItem: 'Add Menu Item',
            changeImage: 'Change',
        },
        tables: {
            title: 'Table Management',
            addTable: 'Add Table',
            seats: 'seats',
            delete: 'Delete table',
            deleteDisabled: 'Cannot delete an occupied or reserved table',
            deleteConfirm: (params) => `Are you sure you want to delete table ${params.tableName}? This cannot be undone.`
        },
        data: {
            title: 'Data Management',
            exportTitle: 'Export & Backup',
            exportDescription: 'Download a complete copy of all your application data. This is useful for creating backups or migrating to a different system. The SQL file can be used to seed a new production database.',
            exporting: 'Exporting...',
            exportJson: 'Export to JSON',
            exportSql: 'Export to SQL',
            resetTitle: 'Reset Application Data',
            resetDescription: 'This will permanently delete all current data including sales, inventory, and customizations, and restore the application to its original demonstration state. This is useful for training or starting fresh.',
            resetButton: 'Reset and Re-seed Database',
        },
        resetWarning: "Are you sure? This will delete ALL current orders, inventory counts, and settings, and restore the application to its initial demo state. This action cannot be undone.",
        resetSuccess: "Database has been reset. The application will now reload.",
        resetError: "An error occurred while resetting the database. Please check the console for details.",
    }
  },
  es: {
    sidebar: {
      pos: 'TPV',
      kds: 'SCD',
      inventory: 'Inventario',
      tables: 'Mesas',
      reservations: 'Reservas',
      reports: 'Informes',
      staff: 'Personal',
      feedback: 'Opiniones',
      settings: 'Ajustes',
      install: 'Instalar App',
      logout: 'Cerrar Sesión',
    },
    login: {
      selectProfile: 'Seleccione su perfil para iniciar sesión',
      password: 'Contraseña',
      enterPassword: 'Introduzca la contraseña',
      login: 'Iniciar Sesión',
      incorrectPassword: 'Contraseña incorrecta. Inténtelo de nuevo.',
      notUser: (params) => `¿No es ${params.name}? Seleccione otro perfil.`,
      customerReservation: '¿Es usted un cliente? Haga una Reserva',
    },
    settings: {
        title: 'Configuración de la Aplicación',
        general: {
            title: 'Configuración General',
            taxRateLabel: 'Tasa de Impuestos sobre Ventas',
            taxRateDescription: 'Esta tasa se aplicará a todas las cuentas en el punto de venta.',
        },
        appearance: {
            title: 'Apariencia e Idioma',
            themeLabel: 'Tema',
            dark: 'Oscuro',
            light: 'Claro',
            themeDescription: 'Cambia el esquema de colores de la aplicación.',
            languageLabel: 'Idioma',
            languageDescription: 'Selecciona el idioma de visualización para la interfaz.',
        },
        saved: 'Guardado',
        saveChanges: 'Guardar Cambios',
        cancel: 'Cancelar',
        url: {
            title: 'Ajustes de URL Pública / Código QR',
            label: 'URL Base',
            warningTitle: 'Este es un ajuste crítico para las funciones de cara al cliente.',
            warningDescription1: 'Después de desplegar su aplicación a una dirección web pública (p. ej., <code>https://mi-app-barnest.com</code>), debe introducir esa dirección completa aquí. Esto asegura que los códigos QR generados para los pedidos en mesa apunten a la aplicación correcta y en vivo.',
            warningDescription2: 'Por favor, no incluya una barra inclinada (/) al final de la URL.',
        },
        menu: {
            title: 'Gestión del Menú',
            addItem: 'Añadir Artículo',
            changeImage: 'Cambiar',
        },
        tables: {
            title: 'Gestión de Mesas',
            addTable: 'Añadir Mesa',
            seats: 'asientos',
            delete: 'Eliminar mesa',
            deleteDisabled: 'No se puede eliminar una mesa ocupada o reservada',
            deleteConfirm: (params) => `¿Está seguro de que desea eliminar la mesa ${params.tableName}? Esta acción no se puede deshacer.`
        },
        data: {
            title: 'Gestión de Datos',
            exportTitle: 'Exportar y Copia de Seguridad',
            exportDescription: 'Descargue una copia completa de todos los datos de su aplicación. Es útil para crear copias de seguridad o migrar a otro sistema. El archivo SQL se puede usar para poblar una nueva base de datos de producción.',
            exporting: 'Exportando...',
            exportJson: 'Exportar a JSON',
            exportSql: 'Exportar a SQL',
            resetTitle: 'Restablecer Datos de la Aplicación',
            resetDescription: 'Esto eliminará permanentemente todos los datos actuales, incluyendo ventas, inventario y personalizaciones, y restaurará la aplicación a su estado de demostración original. Es útil para formación o para empezar de nuevo.',
            resetButton: 'Restablecer y Repoblar Base de Datos',
        },
        resetWarning: "¿Está seguro? Esto eliminará TODOS los pedidos actuales, recuentos de inventario y ajustes, y restaurará la aplicación a su estado de demostración inicial. Esta acción no se puede deshacer.",
        resetSuccess: "La base de datos se ha restablecido. La aplicación se recargará ahora.",
        resetError: "Ocurrió un error al restablecer la base de datos. Por favor, revise la consola para más detalles.",
    }
  },
  fr: {
    sidebar: {
      pos: 'PDV',
      kds: 'SEC',
      inventory: 'Inventaire',
      tables: 'Tables',
      reservations: 'Réservations',
      reports: 'Rapports',
      staff: 'Personnel',
      feedback: 'Avis',
      settings: 'Paramètres',
      install: 'Installer l\'App',
      logout: 'Déconnexion',
    },
    login: {
      selectProfile: 'Sélectionnez votre profil pour vous connecter',
      password: 'Mot de passe',
      enterPassword: 'Entrez le mot de passe',
      login: 'Connexion',
      incorrectPassword: 'Mot de passe incorrect. Veuillez réessayer.',
      notUser: (params) => `Pas ${params.name} ? Sélectionnez un autre profil.`,
      customerReservation: 'Êtes-vous un client ? Faites une réservation',
    },
    settings: {
        title: 'Paramètres de l\'Application',
        general: {
            title: 'Configuration Générale',
            taxRateLabel: 'Taux de Taxe de Vente',
            taxRateDescription: 'Ce taux sera appliqué à toutes les additions au point de vente.',
        },
        appearance: {
            title: 'Apparence et Langue',
            themeLabel: 'Thème',
            dark: 'Sombre',
            light: 'Clair',
            themeDescription: 'Changez le jeu de couleurs de l\'application.',
            languageLabel: 'Langue',
            languageDescription: 'Sélectionnez la langue d\'affichage de l\'interface.',
        },
        saved: 'Enregistré',
        saveChanges: 'Enregistrer les modifications',
        cancel: 'Annuler',
        url: {
            title: 'Paramètres d\'URL Publique / Code QR',
            label: 'URL de Base',
            warningTitle: 'Ceci est un paramètre critique pour les fonctionnalités orientées client.',
            warningDescription1: 'Après avoir déployé votre application sur une adresse web publique (par ex., <code>https://mon-app-barnest.com</code>), vous devez entrer cette adresse complète ici. Cela garantit que les codes QR générés pour la commande à table pointent vers l\'application correcte et en direct.',
            warningDescription2: 'Veuillez ne pas inclure de barre oblique (/) à la fin de l\'URL.',
        },
        menu: {
            title: 'Gestion du Menu',
            addItem: 'Ajouter un Article',
            changeImage: 'Changer',
        },
        tables: {
            title: 'Gestion des Tables',
            addTable: 'Ajouter une Table',
            seats: 'places',
            delete: 'Supprimer la table',
            deleteDisabled: 'Impossible de supprimer une table occupée ou réservée',
            deleteConfirm: (params) => `Êtes-vous sûr de vouloir supprimer la table ${params.tableName} ? Cette action est irréversible.`
        },
        data: {
            title: 'Gestion des Données',
            exportTitle: 'Exportation et Sauvegarde',
            exportDescription: 'Téléchargez une copie complète de toutes les données de votre application. Utile pour créer des sauvegardes ou migrer vers un autre système. Le fichier SQL peut être utilisé pour initialiser une nouvelle base de données de production.',
            exporting: 'Exportation...',
            exportJson: 'Exporter en JSON',
            exportSql: 'Exporter en SQL',
            resetTitle: 'Réinitialiser les Données de l\'Application',
            resetDescription: 'Cela supprimera définitivement toutes les données actuelles, y compris les ventes, l\'inventaire et les personnalisations, et restaurera l\'application à son état de démonstration d\'origine. Utile pour la formation ou pour repartir à zéro.',
            resetButton: 'Réinitialiser et Ré-initialiser la Base de Données',
        },
        resetWarning: "Êtes-vous sûr ? Cela supprimera TOUTES les commandes actuelles, les inventaires et les paramètres, et restaurera l'application à son état de démonstration initial. Cette action est irréversible.",
        resetSuccess: "La base de données a été réinitialisée. L'application va maintenant se recharger.",
        resetError: "Une erreur s'est produite lors de la réinitialisation de la base de données. Veuillez vérifier la console pour plus de détails.",
    }
  },
  pt: {
    sidebar: {
      pos: 'PDV',
      kds: 'SDC',
      inventory: 'Inventário',
      tables: 'Mesas',
      reservations: 'Reservas',
      reports: 'Relatórios',
      staff: 'Equipa',
      feedback: 'Feedback',
      settings: 'Definições',
      install: 'Instalar App',
      logout: 'Sair',
    },
    login: {
      selectProfile: 'Selecione o seu perfil para entrar',
      password: 'Palavra-passe',
      enterPassword: 'Digite a palavra-passe',
      login: 'Entrar',
      incorrectPassword: 'Palavra-passe incorreta. Por favor, tente novamente.',
      notUser: (params) => `Não é ${params.name}? Selecione um perfil diferente.`,
      customerReservation: 'É um cliente? Faça uma Reserva',
    },
    settings: {
        title: 'Definições da Aplicação',
        general: {
            title: 'Configuração Geral',
            taxRateLabel: 'Taxa de Imposto sobre Vendas',
            taxRateDescription: 'Esta taxa será aplicada a todas as contas no ponto de venda.',
        },
        appearance: {
            title: 'Aparência e Idioma',
            themeLabel: 'Tema',
            dark: 'Escuro',
            light: 'Claro',
            themeDescription: 'Altere o esquema de cores da aplicação.',
            languageLabel: 'Idioma',
            languageDescription: 'Selecione o idioma de exibição da interface.',
        },
        saved: 'Guardado',
        saveChanges: 'Guardar Alterações',
        cancel: 'Cancelar',
        url: {
            title: 'Definições de URL Público / Código QR',
            label: 'URL Base',
            warningTitle: 'Esta é uma definição crítica para as funcionalidades voltadas para o cliente.',
            warningDescription1: 'Depois de implementar a sua aplicação num endereço web público (p. ex., <code>https://minha-app-barnest.com</code>), deve inserir esse endereço completo aqui. Isto garante que os códigos QR gerados para pedidos na mesa apontem para a aplicação correta e ativa.',
            warningDescription2: 'Por favor, não inclua uma barra (/) no final do URL.',
        },
        menu: {
            title: 'Gestão do Menu',
            addItem: 'Adicionar Item',
            changeImage: 'Alterar',
        },
        tables: {
            title: 'Gestão de Mesas',
            addTable: 'Adicionar Mesa',
            seats: 'lugares',
            delete: 'Eliminar mesa',
            deleteDisabled: 'Não é possível eliminar uma mesa ocupada ou reservada',
            deleteConfirm: (params) => `Tem a certeza de que deseja eliminar a mesa ${params.tableName}? Esta ação não pode ser desfeita.`
        },
        data: {
            title: 'Gestão de Dados',
            exportTitle: 'Exportar e Backup',
            exportDescription: 'Descarregue uma cópia completa de todos os dados da sua aplicação. Útil para criar backups ou migrar para outro sistema. O ficheiro SQL pode ser usado para popular uma nova base de dados de produção.',
            exporting: 'A exportar...',
            exportJson: 'Exportar para JSON',
            exportSql: 'Exportar para SQL',
            resetTitle: 'Repor Dados da Aplicação',
            resetDescription: 'Isto irá apagar permanentemente todos os dados atuais, incluindo vendas, inventário e personalizações, e restaurar a aplicação ao seu estado de demonstração original. Útil para formação ou para começar de novo.',
            resetButton: 'Repor e Popular a Base de Dados',
        },
        resetWarning: "Tem a certeza? Isto irá apagar TODAS as encomendas, contagens de inventário e definições atuais, e restaurar a aplicação ao seu estado de demonstração inicial. Esta ação não pode ser desfeita.",
        resetSuccess: "A base de dados foi reposta. A aplicação será agora recarregada.",
        resetError: "Ocorreu um erro ao repor a base de dados. Por favor, verifique a consola para mais detalhes.",
    }
  },
};
