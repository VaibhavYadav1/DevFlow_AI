export interface Tasks {
  _id: string;
  project_name: string;
  progress: number;
  status: string;
  parsed_id: string;
}

export interface ASTProject {
  project_name: string;
  root_path: string;
  total_files: number;
  files?: ASTFile[];
}

export interface ASTFile {
  file_path: string;
  language: string;
  functions?: string[];
  classes?: string[];
  imports?: string[];
  controller?: ASTController;
  service?: ASTService;
}

export interface ASTController {
  routes: string[];
  functions: string[];
}

export interface ASTService {
  classes: string[];
  functions: string[];
}
