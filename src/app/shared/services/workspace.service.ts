import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Block } from 'src/app/voice/models/conversation-model';
import { Project, Textlist } from 'src/app/voice/models/workspace-model';
import { environment } from 'src/environments/environment';
const { webapi } = environment

interface ResponseAPI {
  status: number
  message: any
}
@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  textData: any
  $workspace = new BehaviorSubject<Project[]>(null) // global variable for stored workspace data
  $textlist = new BehaviorSubject<Textlist[]>(null) // global variable for stored text list based on workspace_id key
  isSaved: boolean
  constructor(
    private http: HttpClient,
    private _auth: AuthService,
  ) { }

  setSave(data: boolean) {
    this.isSaved = data;
  }

  getSave() {
    return this.isSaved;
  }

  /** Update workspace data to global stored variable  */
  updateWorkspace(data: Project[]) {
    this.$workspace.next(data)
  }

  /** Update textlist data, Textlist data is all audio bubble from studio page */
  updateTextList(data: any[]) {
    this.$textlist.next(data)
  }

  // Get the list of workspace name
  getWorkspace() {
    const url = webapi + '/workspace/get_all_workspace';
    return this.http.get<ResponseAPI>(url, this._auth.getHeader())
  }

  // Insert one workspace
  insertWorkspace(body: any) {
    const url = webapi + '/workspace/insert_workspace';
    return this.http.post<any>(url, body, this._auth.getHeader());
  }

  // Edit one workspace
  editWorkspace(body: any) {
    const url = webapi + '/workspace/edit_workspace';

    return this.http.post<ResponseAPI>(url, body, this._auth.getHeader());
  }

  // Delete one workspace
  deleteWorkspace(workspace_id: string) {
    const url = webapi + '/workspace/delete_workspace';
    return this.http.post<ResponseAPI>(url, { workspace_id }, this._auth.getHeader());
  }

  // Get text from current workspace
  getTextWorkspace(workspace: string) {
    const url = webapi + '/workspace/get_workspace?workspace_id=' + workspace;
    return this.http.get<any>(url, this._auth.getHeader());
  }

  // Saving all text inside current workspace
  saveTextWorkspace(data: any) {
    const url = webapi + '/workspace/workspace_text_save';
    return this.http.post<any>(url, data, this._auth.getHeader());
  }
}
