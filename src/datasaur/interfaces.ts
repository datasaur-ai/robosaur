export interface Project {
  id: string;
  name: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}
