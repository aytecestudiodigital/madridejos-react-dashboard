import { supabase } from "../../../../server/supabase";

export const getUsersJoinRoles = async (
  tableNameUsers: string,
  tableNameRoles: string,
): Promise<{ data: any[] | null }> => {
  try {
    // Consulta para obtener usuarios
    const { data: usersData, error: usersError } = await supabase
      .from(tableNameUsers)
      .select("*")
      .not("role", "is", null);

    if (usersError) {
      console.error("Error fetching users data:", usersError.message);
      return { data: [] };
    }

    // Consulta para obtener roles
    const { data: rolesData, error: rolesError } = await supabase
      .from(tableNameRoles)
      .select("*");

    if (rolesError) {
      console.error("Error fetching roles data:", rolesError.message);
      return { data: [] };
    }

    // Combinar resultados
    const combinedData = usersData.map((user) => {
      const role = rolesData.find((role) => role.id === user.role);
      return { ...user, role };
    });

    // Ordenar por título del grupo
    combinedData.sort((a, b) => {
      const lengthA = a.role?.title.length || 0;
      const lengthB = b.role?.title.length || 0;
      return lengthA - lengthB;
    });

    return { data: combinedData };
  } catch (error: any) {
    console.error("Error:", error.message);
    return { data: [] };
  }
};
