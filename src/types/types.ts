export interface Usuaria {
  _id: string;
  nombre: string;
  fotoDePerfil: string;
}

export interface Post {
  _id: string;
  usuariaId: Usuaria;
  imagenUrl: string;
  descripcion: string;
  etiqueta?: string;
  aprobado: boolean;
  fecha: string;
}

export interface Like {
  _id: string;
  postId: string;
  usuariaId: string;
}

export interface Guardado {
  _id: string;
  postId: Post;
  usuariaId: string;
  fecha: string;
}