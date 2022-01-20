export interface Project {
  id: string;
  name: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface LabelItem {
  id: string;
  parentId?: string | null;
  label: string;
  color?: string | null;
}

export interface LabelSet {
  label: string;
  config: {
    options: LabelItem[];
  };
}
