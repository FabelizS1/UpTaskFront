import { Project, TeamMember } from "../types"


// Donde recibe los tipos de datos managerId: Project['manager'], userId: TeamMember['_id'] con las variables
export const isManager = (managerId: Project['manager'], userId: TeamMember['_id']) => managerId === userId