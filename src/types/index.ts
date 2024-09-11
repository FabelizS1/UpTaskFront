import { z } from 'zod'

/** Auth & Users */
const authSchema = z.object({   /// Estos son los types de la autenticacion
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth, 'password'>

/** Users */
export const userSchema = authSchema.pick({ /// Valores que se van a agregar
    name: true,
    email: true
}).extend({  // Con extends se agrega un atributo extra
    _id: z.string()
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

/** Notes */
const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})
export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>

/** Tasks */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed" ]) // Son las opciones de los estados de las tareas

export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({  /// Este es el esquema de Task
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,  // Estos son las opciones de Status
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema.extend({  // Usan extend porque se va a agregar algo mas y seria el createdBy
        createdBy: userSchema
    })),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskSchema>  // El Task

export type TaskFormData = Pick<Task, 'name' | 'description'>  // Solo tendra la opcion de name y description

export type TaskProject = z.infer<typeof taskProjectSchema>

/** Projects */
export const projectSchema = z.object({  /// Esto viene de la respuesta del json
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(userSchema.pick({_id: true})), // Con esto se toma el id del manager
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string(userSchema.pick({_id: true}))) // Se selecciona de user schema eñ id
})

export const dashboardProjectSchema = z.array(   // Es  como  projectSchema pero un array
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true  // Que quiere heredar el manager de projectSchemas
    })
)
export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true,
})


export type Project = z.infer<typeof projectSchema>  /// Este es el Export
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description' > // Donde Project es el type de donde se van a tomar estos valores, Esto es para el tipo de dato del form, que solo toma estos 3 valores


/** Team */
const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>