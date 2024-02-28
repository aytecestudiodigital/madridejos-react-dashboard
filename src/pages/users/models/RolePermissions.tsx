export const permissions = {
  organization: [
    {
      action: "access_dashboard",
      label: "Acceso al dashboard",
      id: 0,
    },
    {
      action: "update",
      label: "Actualizar la configuración de la organización",
      id: 1,
    },
    {
      action: "read",
      label: "Leer la configuración de la organización",
      id: 2,
    },
  ],
  content: {
    contents: {
      order: 1,
      group_title: "Contenidos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de contenido",
          id: 3,
        },
        {
          action: "create",
          label: "Crear contenido",
          description: "Este permiso habilita para la creación de contenido",
          id: 3,
        },
        {
          action: "read_all",
          label: "Ver todos",
          description:
            "Este permiso habilita para consultar todos los elementos de contenido",
          id: 4,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los contenidos creados por el propio usuario",
          id: 5,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los contenidos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 6,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los elementos de contenido",
          id: 7,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los contenidos creados por el propio usuario",
          id: 8,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los contenidos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 9,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos los elementos de contenido",
          id: 10,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los contenidos creados por el propio usuario",
          id: 11,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los contenidos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 12,
        },
      ],
    },
    categories: {
      order: 2,
      group_title: "Categorias",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de categorias",
          id: 3,
        },
        {
          action: "create",
          label: "Crear categorias",
          description: "Este permiso habilita para la creación de categorias",
          id: 13,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todas las categorias",
          id: 14,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar las categorias creadas por el propio usuario",
          id: 15,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar las categorias creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 16,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todas las categorias",
          id: 17,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar las categorias creadas por el propio usuario",
          id: 18,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar las categorias creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 19,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todas las categorias",
          id: 20,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar las categorias creadas por el propio usuario",
          id: 21,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar las categorias creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 22,
        },
      ],
    },
    entities: {
      order: 3,
      group_title: "Entidades",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de entidades",
          id: 3,
        },
        {
          action: "create",
          label: "Crear entidades",
          description: "Este permiso habilita para la creación de entidades",
          id: 23,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todas las entidades",
          id: 24,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar las entidades creadas por el propio usuario",
          id: 25,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar las entidades creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 26,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todas las entidades",
          id: 27,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar las entidades creadas por el propio usuario",
          id: 28,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar las entidades creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 29,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todas las entidades",
          id: 30,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar las entidades creadas por el propio usuario",
          id: 31,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar las entidades creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 32,
        },
      ],
    },
  },
  bookings: {
    installations: {
      order: 1,
      group_title: "Instalaciones",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de instalaciones",
          id: 3,
        },
        {
          action: "create",
          label: "Crear instalaciones",
          description:
            "Este permiso habilita para la creación de instalaciones",
          id: 33,
        },
        {
          action: "read_all",
          label: "Ver todos",
          description:
            "Este permiso habilita para consultar todas las instalaciones",
          id: 34,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar las instalaciones creadas por el propio usuario",
          id: 35,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar las instalaciones creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 36,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todas las instalaciones",
          id: 37,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar las instalaciones creadas por el propio usuario",
          id: 38,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar las instalaciones creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 39,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todas las instalaciones",
          id: 40,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar las instalaciones creadas por el propio usuario",
          id: 41,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los grupos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 42,
        },
      ],
    },
    installation_items: {
      order: 2,
      group_title: "Pistas/servicios",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de items de instalación",
          id: 3,
        },
        {
          action: "create",
          label: "Crear pistas",
          description: "Este permiso habilita para la creación de pistas",
          id: 43,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todas las pistas",
          id: 44,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar las pistas creadas por el propio usuario",
          id: 45,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar las pistas creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 46,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todas las pistas",
          id: 47,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar las pistas creadas por el propio usuario",
          id: 48,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar las pistas creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 49,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todas las pistas",
          id: 50,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar las pistas creadas por el propio usuario",
          id: 51,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar las pistas creadas por usuarios del mismo grupo al que pertenece el usuario",
          id: 52,
        },
      ],
    },
    bookings: {
      order: 3,
      group_title: "Reservas",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de reservas",
          id: 3,
        },
        {
          action: "create",
          label: "Crear reservas",
          description: "Este permiso habilita para la creación de reservas",
          id: 53,
        },
        {
          action: "update",
          label: "Modificar reservas",
          description: "Este permiso habilita para la modificación de reservas",
          id: 54,
        },
        {
          action: "read",
          label: "Consultar reservas",
          description: "Este permiso habilita para la consulta de reservas",
          id: 55,
        },
        {
          action: "delete",
          label: "Borrar reservas",
          description: "Este permiso habilita para borrar reservas",
          id: 56,
        },
      ],
    },
    installation_state: {
      order: 3,
      group_title: "Estados de instalación",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de estados de instalación",
          id: 3,
        },
        {
          action: "create",
          label: "Crear estados de instalación",
          description:
            "Este permiso habilita la creación de estados de instalación",
          id: 53,
        },
        {
          action: "update",
          label: "Modificar estados de instalación",
          description:
            "Este permiso habilita la modificación de estados de instalación",
          id: 54,
        },
        {
          action: "read",
          label: "Consultar estados de instalación",
          description:
            "Este permiso habilita la consulta de estados de instalación",
          id: 55,
        },
        {
          action: "delete",
          label: "Borrar estados de instalación",
          description:
            "Este permiso habilita el borrado de estados de instalación",
          id: 56,
        },
      ],
    },
  },
  users: {
    groups: {
      order: 1,
      group_title: "Grupos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de grupos",
          id: 3,
        },
        {
          action: "create",
          label: "Crear grupos",
          description: "Este permiso habilita para la creación de grupos",
          id: 57,
        },
        {
          action: "read_all",
          label: "Ver todos",
          description: "Este permiso habilita para consultar todos los grupos",
          id: 58,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los grupos creados por el propio usuario",
          id: 59,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los grupos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 60,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los grupos",
          id: 61,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los grupos creados por el propio usuario",
          id: 62,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los grupos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 63,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los grupos",
          id: 64,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los grupos creados por el propio usuario",
          id: 65,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los grupos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 66,
        },
      ],
    },
    roles: {
      order: 2,
      group_title: "Roles y permisos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de roles",
          id: 3,
        },
        {
          action: "create",
          label: "Crear roles",
          description: "Este permiso habilita para la creación de roles",
          id: 67,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los roles",
          id: 68,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los roles creados por el propio usuario",
          id: 69,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los roles creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 70,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los roles",
          id: 71,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los roles creados por el propio usuario",
          id: 72,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los roles creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 73,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los roles",
          id: 74,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los roles creados por el propio usuario",
          id: 75,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los roles creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 76,
        },
      ],
    },
    users: {
      order: 3,
      group_title: "Usuarios",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de usuarios",
          id: 3,
        },
        {
          action: "create",
          label: "Crear usuarios",
          description: "Este permiso habilita para la creación de usuarios",
          id: 77,
        },
        {
          action: "update",
          label: "Modificar usuarios",
          description: "Este permiso habilita para la modificación de usuarios",
          id: 78,
        },
        {
          action: "read",
          label: "Consultar usuarios",
          description: "Este permiso habilita para la consulta de usuarios",
          id: 79,
        },
        {
          action: "delete",
          label: "Borrar usuarios",
          description: "Este permiso habilita para borrar usuarios",
          id: 80,
        },
      ],
    },
  },
  design: {
    sections: {
      order: 3,
      group_title: "Secciones y portadas",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de secciones",
          id: 3,
        },
        {
          action: "create",
          label: "Crear secciones",
          description: "Este permiso habilita para la creación de secciones",
          id: 81,
        },
        {
          action: "update",
          label: "Modificar secciones",
          description:
            "Este permiso habilita para la modificación de secciones",
          id: 82,
        },
        {
          action: "read",
          label: "Consultar secciones",
          description: "Este permiso habilita para la consulta de secciones",
          id: 83,
        },
        {
          action: "delete",
          label: "Borrar secciones",
          description: "Este permiso habilita para borrar secciones",
          id: 84,
        },
      ],
    },
    navigation: {
      order: 3,
      group_title: "Navegación",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de navegación",
          id: 3,
        },
        {
          action: "create",
          label: "Crear menú",
          description: "Este permiso habilita para la creación de menús",
          id: 85,
        },
        {
          action: "update",
          label: "Modificar menú",
          description: "Este permiso habilita para la modificación de menús",
          id: 86,
        },
        {
          action: "read",
          label: "Consultar menú",
          description: "Este permiso habilita para la consulta de menús",
          id: 87,
        },
        {
          action: "delete",
          label: "Borrar menú",
          description: "Este permiso habilita para borrar menús",
          id: 88,
        },
      ],
    },
    templates: {
      order: 3,
      group_title: "Plantillas de contenido",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de plantillas",
          id: 3,
        },
        {
          action: "create",
          label: "Crear plantillas",
          description: "Este permiso habilita para la creación de plantillas",
          id: 89,
        },
        {
          action: "update",
          label: "Modificar plantillas",
          description:
            "Este permiso habilita para la modificación de plantillas",
          id: 90,
        },
        {
          action: "read",
          label: "Consultar plantillas",
          description: "Este permiso habilita para la consulta de plantillas",
          id: 91,
        },
        {
          action: "delete",
          label: "Borrar plantillas",
          description: "Este permiso habilita para borrar plantillas",
          id: 92,
        },
      ],
    },
  },
  communication: {
    push: {
      order: 1,
      group_title: "Notificaciones push",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de notificaciones",
          id: 3,
        },
        {
          action: "create",
          label: "Crear notificaciones",
          description:
            "Este permiso habilita para la creación de notificaciones",
          id: 93,
        },
        {
          action: "update",
          label: "Modificar notificaciones",
          description:
            "Este permiso habilita para la modificación de notificaciones",
          id: 94,
        },
        {
          action: "read",
          label: "Consultar notificaciones",
          description:
            "Este permiso habilita para la consulta de notificaciones",
          id: 95,
        },
        {
          action: "delete",
          label: "Borrar notificaciones",
          description: "Este permiso habilita para borrar notificaciones",
          id: 96,
        },
      ],
    },
    warnings: {
      order: 2,
      group_title: "Alertas",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de alertas",
          id: 3,
        },
        {
          action: "create",
          label: "Crear alertas",
          description: "Este permiso habilita para la creación de alertas",
          id: 97,
        },
        {
          action: "update",
          label: "Modificar alertas",
          description: "Este permiso habilita para la modificación de alertas",
          id: 98,
        },
        {
          action: "read",
          label: "Consultar alertas",
          description: "Este permiso habilita para la consulta de alertas",
          id: 99,
        },
        {
          action: "delete",
          label: "Borrar alertas",
          description: "Este permiso habilita para borrar alertas",
          id: 100,
        },
      ],
    },
    emails: {
      order: 3,
      group_title: "Emails",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de emails",
          id: 3,
        },
        {
          action: "create",
          label: "Crear emails",
          description: "Este permiso habilita para la creación de emails",
          id: 101,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los emails",
          id: 102,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los emails creados por el propio usuario",
          id: 103,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los emails creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 104,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los emails",
          id: 105,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los emails creados por el propio usuario",
          id: 106,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los emails creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 107,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los emails",
          id: 108,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los emails creados por el propio usuario",
          id: 109,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los emails creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 110,
        },
      ],
    },
  },
  inscriptions: {
    records: {
      order: 1,
      group_title: "Registros",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de registros",
          id: 3,
        },
        {
          action: "create",
          label: "Crear registros",
          description: "Este permiso habilita para la creación de registros",
          id: 111,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todos los registros",
          id: 112,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los registros creados por el propio usuario",
          id: 113,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los registros creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 114,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los registros",
          id: 115,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los registros creados por el propio usuario",
          id: 116,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los registros creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 117,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos los registros",
          id: 118,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los registros creados por el propio usuario",
          id: 119,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los registros creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 120,
        },
      ],
    },
    inscriptions: {
      order: 2,
      group_title: "Inscripciones",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de inscripciones",
          id: 3,
        },
        {
          action: "create",
          label: "Crear inscripciones",
          description:
            "Este permiso habilita para la creación de inscripciones",
          id: 121,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todos los inscripciones",
          id: 122,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los inscripciones creados por el propio usuario",
          id: 123,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los inscripciones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 124,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los inscripciones",
          id: 125,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los inscripciones creados por el propio usuario",
          id: 126,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los inscripciones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 127,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos los inscripciones",
          id: 128,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los inscripciones creados por el propio usuario",
          id: 129,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los inscripciones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 130,
        },
      ],
    },
  },
  tasks: {
    projects: {
      order: 1,
      group_title: "Proyectos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de proyectos",
          id: 3,
        },
        {
          action: "create",
          label: "Crear proyectos",
          description: "Este permiso habilita para la creación de proyectos",
          id: 131,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todos los proyectos",
          id: 132,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los proyectos creados por el propio usuario",
          id: 133,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los proyectos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 134,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los proyectos",
          id: 135,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los proyectos creados por el propio usuario",
          id: 136,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los proyectos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 137,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos los proyectos",
          id: 138,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los proyectos creados por el propio usuario",
          id: 139,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los proyectos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 140,
        },
      ],
    },
    tasks: {
      order: 2,
      group_title: "Tareas",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de tareas",
          id: 3,
        },
        {
          action: "create",
          label: "Crear tareas",
          description: "Este permiso habilita para la creación de tareas",
          id: 141,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los tareas",
          id: 142,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los tareas creados por el propio usuario",
          id: 143,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los tareas creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 144,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los tareas",
          id: 145,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los tareas creados por el propio usuario",
          id: 146,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los tareas creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 147,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los tareas",
          id: 148,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los tareas creados por el propio usuario",
          id: 149,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los tareas creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 150,
        },
      ],
    },
  },
  payments: {
    payments: {
      order: 1,
      group_title: "Pagos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de pagos",
          id: 3,
        },
        {
          action: "create",
          label: "Crear pagos",
          description: "Este permiso habilita para la creación de pagos",
          id: 151,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los pagos",
          id: 152,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los pagos creados por el propio usuario",
          id: 153,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los pagos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 154,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los pagos",
          id: 155,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los pagos creados por el propio usuario",
          id: 156,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los pagos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 157,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los pagos",
          id: 158,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los pagos creados por el propio usuario",
          id: 159,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los pagos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 160,
        },
      ],
    },
    method_payments: {
      order: 2,
      group_title: "Métodos de pago",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de métodos de pago",
          id: 3,
        },
        {
          action: "create",
          label: "Crear métodos",
          description: "Este permiso habilita para la creación de métodos",
          id: 161,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los métodos",
          id: 162,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los métodos creados por el propio usuario",
          id: 163,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los métodos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 164,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los métodos",
          id: 165,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los métodos creados por el propio usuario",
          id: 166,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los métodos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 167,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los métodos",
          id: 168,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los métodos creados por el propio usuario",
          id: 169,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los métodos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 170,
        },
      ],
    },
    mandates: {
      order: 2,
      group_title: "Mandatos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de mandatos",
          id: 3,
        },
        {
          action: "create",
          label: "Crear mandatos",
          description: "Este permiso habilita para la creación de mandatos",
          id: 171,
        },
        {
          action: "update",
          label: "Modificar mandatos",
          description: "Este permiso habilita para la modificación de mandatos",
          id: 172,
        },
        {
          action: "read",
          label: "Consultar mandatos",
          description: "Este permiso habilita para la consulta de mandatos",
          id: 173,
        },
        {
          action: "delete",
          label: "Borrar mandatos",
          description: "Este permiso habilita para borrar mandatos",
          id: 174,
        },
      ],
    },
    coupons: {
      order: 4,
      group_title: "Cupones",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de cupones",
          id: 3,
        },
        {
          action: "create",
          label: "Crear cupones",
          description: "Este permiso habilita para la creación de cupones",
          id: 175,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los cupones",
          id: 176,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los cupones creados por el propio usuario",
          id: 177,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los cupones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 178,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los cupones",
          id: 179,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los cupones creados por el propio usuario",
          id: 180,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los cupones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 181,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los cupones",
          id: 182,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los cupones creados por el propio usuario",
          id: 183,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los cupones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 184,
        },
      ],
    },
    payments_accounts: {
      order: 4,
      group_title: "Cuentas de pago",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de cuentas de pago",
          id: 3,
        },
        {
          action: "create",
          label: "Crear cuentas de pago",
          description:
            "Este permiso habilita para la creación de cuentas de pago",
          id: 175,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todas las cuentas de pago",
          id: 176,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar las cuentas de pago creados por el propio usuario",
          id: 177,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar las cuentas de pago creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 178,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos las cuentas de pago",
          id: 179,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar las cuentas de pago creados por el propio usuario",
          id: 180,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar las cuentas de pago creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 181,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos las cuentas de pago",
          id: 182,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar las cuentas de pago creados por el propio usuario",
          id: 183,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar las cuentas de pago creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 184,
        },
      ],
    },
  },
  tickets: {
    tickets: {
      order: 1,
      group_title: "Entradas",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de tickets",
          id: 3,
        },
        {
          action: "create",
          label: "Crear entradas",
          description: "Este permiso habilita para la creación de entradas",
          id: 185,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todos los entradas",
          id: 186,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los entradas creados por el propio usuario",
          id: 187,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los entradas creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 188,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los entradas",
          id: 189,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los entradas creados por el propio usuario",
          id: 190,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los entradas creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 191,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los entradas",
          id: 192,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los entradas creados por el propio usuario",
          id: 193,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los entradas creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 194,
        },
      ],
    },
    events: {
      order: 2,
      group_title: "Eventos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description: "Este permiso habilita el acceso al módulo de eventos",
          id: 3,
        },
        {
          action: "create",
          label: "Crear eventos",
          description: "Este permiso habilita para la creación de eventos",
          id: 195,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description: "Este permiso habilita para consultar todos los eventos",
          id: 196,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los eventos creados por el propio usuario",
          id: 197,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los eventos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 198,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description: "Este permiso habilita para modificar todos los eventos",
          id: 199,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los eventos creados por el propio usuario",
          id: 200,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los eventos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 201,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description: "Este permiso habilita para eliminar todos los eventos",
          id: 202,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los eventos creados por el propio usuario",
          id: 203,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los eventos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 204,
        },
      ],
    },
  },
  access_control: {
    devices: {
      order: 1,
      group_title: "Dispositivos",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de dispositivos",
          id: 3,
        },
        {
          action: "create",
          label: "Crear dispositivos",
          description: "Este permiso habilita para la creación de dispositivos",
          id: 205,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todos los dispositivos",
          id: 206,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los dispositivos creados por el propio usuario",
          id: 207,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los dispositivos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 208,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los dispositivos",
          id: 209,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los dispositivos creados por el propio usuario",
          id: 210,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los dispositivos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 211,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos los dispositivos",
          id: 212,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los dispositivos creados por el propio usuario",
          id: 213,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los dispositivos creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 214,
        },
      ],
    },
  },
  competitions: {
    competitions: {
      order: 1,
      group_title: "Competiciones",
      actions: [
        {
          action: "access_module",
          label: "Acceso al módulo",
          description:
            "Este permiso habilita el acceso al módulo de competiciones",
          id: 3,
        },
        {
          action: "create",
          label: "Crear competiciones",
          description:
            "Este permiso habilita para la creación de competiciones",
          id: 215,
        },
        {
          action: "read_all",
          label: "Ver todo",
          description:
            "Este permiso habilita para consultar todos los competiciones",
          id: 216,
        },
        {
          action: "read_own",
          label: "Ver propios",
          description:
            "Este permiso habilita sólo para consultar los competiciones creados por el propio usuario",
          id: 217,
        },
        {
          action: "read_group",
          label: "Ver mi grupo",
          description:
            "Este permiso habilita para consultar los competiciones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 218,
        },
        {
          action: "update_all",
          label: "Actualizar todos",
          description:
            "Este permiso habilita para modificar todos los competiciones",
          id: 219,
        },
        {
          action: "update_own",
          label: "Actualizar propios",
          description:
            "Este permiso habilita sólo para editar los competiciones creados por el propio usuario",
          id: 220,
        },
        {
          action: "update_group",
          label: "Actualizar mi grupo",
          description:
            "Este permiso habilita para editar los competiciones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 221,
        },
        {
          action: "delete_all",
          label: "Borrar todos",
          description:
            "Este permiso habilita para eliminar todos los competiciones",
          id: 222,
        },
        {
          action: "delete_own",
          label: "Borrar propios",
          description:
            "Este permiso habilita sólo para eliminar los competiciones creados por el propio usuario",
          id: 223,
        },
        {
          action: "delete_group",
          label: "Borrar mi grupo",
          description:
            "Este permiso habilita para eliminar los competiciones creados por usuarios del mismo grupo al que pertenece el usuario",
          id: 224,
        },
      ],
    },
  },
};
