import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { TH } from 'src/app/shared/change_language/TH';
import { EN } from 'src/app/shared/change_language/EN';
import { Observable, Subscription } from 'rxjs';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { catchError, filter, switchMap, takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { AlertProjFullComponent } from './dialog/alert-proj-full/alert-proj-full.component';
import { Project, InsertPayload } from '../models/workspace-model';
import { AlertEditNameComponent } from './dialog/alert-edit-name/alert-edit-name.component';
import { AlertEditPicComponent } from './dialog/alert-edit-pic/alert-edit-pic.component';
import { AlertFlexComponent } from './dialog/alert-flex/alert-flex.component';
import { language } from 'src/app/shared/change_language/language';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';
import { TState } from 'src/app/shared/models/shared-model';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  public isCreateProject: boolean = false;
  public projectAction: string = 'create';
  public actionType: string = '';
  public project_name: string = '';
  public currentType: string = 'conversation';
  public imgSrc: any = '../../../assets/icons/v3/Rectangle 2777.png';
  public currentPackage: string;
  public speakerLists: any;
  public alert: string = '';
  public isAlert: boolean = false;
  public selectedProject: number;
  private cartSubscription: Subscription;
  public isScrolled: boolean = false;

  //----------------------Store-------------------------//
  public projects: Project[] = [];

  public recent_Project: Project[] = [];
  //---------------------Languange-----------------------//
  public lang = 'TH';
  public text: any = null;
  public original_EN_Text = null;
  public projectAuto = 'โปรเจค';
  public createProject = 'สร้างโปรเจคใหม่';
  public insertImage = 'เปลี่ยนรูปภาพ';
  public projectName = 'ชื่อโปรเจค';
  public placeholder = 'โปรเจคใหม่ 1';
  public type = 'ประเภท';
  public createBook = 'สร้างบทความ';
  public createConversation = 'สร้างบทสนทนา';
  public cancel = 'ยกเลิก';
  public submit = 'สร้าง';
  public myProject = 'โปรเจคของฉัน';
  public editProject = 'แก้ไขโปรเจค';

  public lastChange = {
    update: 'แก้ไข',
    ago: 'ชั่วโมงที่ผ่านมา',
  };
  public recentProject = 'โปรเจคล่าสุด';
  public changeName = 'แก้ไขชื่อ';
  public changeImage = 'เปลี่ยนภาพ';
  public deleteProject = 'ลบโปรเจค';
  public deleteAlert = 'คุณต้องการลบโปรคเจคนี้หรือไม่';
  public confirm = 'ตกลง';
  public timeUnit = {
    hour: 'ชั่วโมง',
    day: 'วัน',
    week: 'อาทิตย์',
    month: 'เดือน',
    year: 'ปี',
  };

  maxProject = 100; // Max project amount
  isLoading = false;

  public dialogText = null;

  subscriptionData = {
    SubscriptionPackage: null,
  };

  @ViewChild('newProject') newProject!: ElementRef;

  constructor(
    private router: Router,
    private _workspace: WorkspaceService,
    private _auth: AuthService,
    private _changeLanguage: ChangeLanguageService,
    private _globalFunc: GlobalFunctionService,
    private _dialog: DialogService,
    private _subAPI: SubscriptionAPIService,
    private dialog: MatDialog,
    private _unsub: UnsubscribeService,
  ) {}

  ngOnInit() {
    const sub1 = this._changeLanguage.language
      .pipe(takeUntil(this._unsub.$destroy))
      .subscribe((res) => {
        if (res) {
          this.text = language[res].workspaceObj;
          this.lang = res;
          this.dialogText = language[res].workspaceObj.alertDialog;
        }
      });

    this.original_EN_Text = this.text;

    // this.getCurrentPackage()

    this.getWorkspace();
  }

  // private getCurrentPackage() {
  //   const obs = new Observable<TState>(sub => {
  //     // Get subscription package based on database
  //     this._subAPI.$package
  //       .pipe(
  //         takeUntil(this._unsub.$destroy)
  //       )
  //       .subscribe((resp) => {
  //         if (resp) {
  //           // Get specified monthly package to achieve all package data
  //           const packageMonthly = resp.filter((e) => e.month === 1);

  //           // Prepare temp variable and formatting data
  //           const formattedJSON = {};
  //           for (const item of packageMonthly) {
  //             formattedJSON[item.subscription_rank] = { ...item };
  //           }

  //           // Assign formatted data to global variable
  //           this.subscriptionData.SubscriptionPackage = formattedJSON
  //           sub.next('Completed')
  //           sub.complete()
  //         } else {
  //           sub.next('Loading')
  //         }
  //       });
  //   })

  //   obs.pipe(
  //     takeUntil(this._unsub.$destroy),
  //     filter(state => state === 'Completed'),
  //     switchMap(() => this._auth.data)
  //   ).subscribe(
  //     res => {
  //       if (res) {
  //         this.currentPackage = res.subscription;
  //         // this.maxProject =
  //         //   this.subscriptionData.SubscriptionPackage[
  //         //     this.currentPackageค
  //         //   ]?.workspace;
  //       }
  //     }
  //   )
  // }

  /** Fetching API to get workspace data */
  getWorkspace() {
    // Prepare var
    const $workspace = this._workspace.$workspace;

    // If no stored data then fetching API
    if (!$workspace.getValue()) {
      this.fetchGetWorkspace();
    } else {
      $workspace.subscribe(
        // Call stored data
        (data) => {
          if (data) {
            this.projects = data;

            this.getRecentProject();
          }
        },
      );
    }
  }

  /** Fetching API to get workspace data */
  fetchGetWorkspace() {
    this.isLoading = true;
    this._workspace.getWorkspace().subscribe({
      next: (resp) => {
        this.isLoading = false;
        if (resp.status === 200) {
          const data = resp.message.list_project;
          this.formatWorkspace(data);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
      complete: () => {
        this.isLoading = false;
        this.getTimeInterval();
        this.getRecentProject();
      },
    });
  }

  /** Format data stucture to display HTML */
  formatWorkspace(data: any[]) {
    // Prepare var
    const temp = [];

    // For-loop
    data.forEach(async (workspace: any) => {
      if (workspace.speaker_list.length != 0) {
        temp.push({
          workspace_id: workspace.workspace_id,
          name: workspace.name,
          picture: workspace.picture,
          recent_use: workspace.recent_use,
          speaker_list: workspace.speaker_list,
          isEdit: false,
          type_workspace: workspace.type_workspace,
          speakerImg: null, //list[0].face_image
          timeInterval: 0,
          isAlertDelete: false,
          diffTimeUnit: '',
        });
      } else {
        temp.push({
          workspace_id: workspace.workspace_id,
          name: workspace.name,
          picture: workspace.picture,
          recent_use: workspace.recent_use,
          speaker_list: workspace.speaker_list,
          isEdit: false,
          type_workspace: workspace.type_workspace,
          speakerImg: null,
          timeInterval: 0,
          isAlertDelete: false,
          diffTimeUnit: '',
        });
      }
    });
    this.projects = temp.reverse(); // Sort new data to top
    this._workspace.updateWorkspace(this.projects); // Assign data
  }

  /** Fetching API to create specific workspace */
  insertWorkspace(data: InsertPayload) {
    const sub6 = this._workspace.insertWorkspace(data).subscribe({
      next: (resp) => {},
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  /** Fetching API to edit specific workspace */
  editWorkspace(body: {}) {
    this._workspace.editWorkspace(body).subscribe({
      next: (resp) => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
      complete() {},
    });
  }

  /** Fetching API to delete specific workspace */
  onDelete(id: string, i: any, selector: string) {
    this.isLoading = true;
    this._workspace.deleteWorkspace(id).subscribe({
      next: (resp) => {
        this.isLoading = false;
        if (selector === 'normal') {
          this.projects.splice(i, 1);
          this.getRecentProject();
        } else if (selector === 'recent') {
          const index = this.projects.findIndex(
            (item) => item.workspace_id === id,
          );

          this.recent_Project.splice(i, 1);
          this.projects.splice(index, 1);
          this.getRecentProject();
        }

        this._workspace.updateWorkspace(this.projects);
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  getRecentProject() {
    this.recent_Project = [];
    if (this.projects.length) {
      const time = this.projects.map((item) =>
        new Date(item.recent_use).getTime(),
      );
      const maxTime = Math.max(...time);
      const recentTime = this.projects.find(
        (obj) => new Date(obj.recent_use).getTime() === maxTime,
      );

      this.recent_Project.push({
        workspace_id: this._globalFunc.generateID(),
        name: recentTime.name,
        picture: recentTime.picture,
        recent_use: recentTime.recent_use,
        speaker_list: recentTime.speaker_list,
        isEdit: recentTime.isEdit,
        type_workspace: recentTime.type_workspace,
        speakerImg: recentTime.speakerImg,
        timeInterval: recentTime.timeInterval,
        isAlertDelete: false,
        diffTimeUnit: recentTime.diffTimeUnit,
      });
    }
  }

  getTimeInterval() {
    const currTime = new Date().getTime();

    this.projects.map((project: any) => {
      const lastTime = new Date(project.recent).getTime();
      project.timeInterval = Math.floor((currTime - lastTime) / 1000 / 3600); //Hour

      if (project.timeInterval < 24) {
        project.diffTimeUnit = this.timeUnit.hour;
      } else if (project.timeInterval >= 24 && project.timeInterval < 168) {
        project.timeInterval = Math.floor(project.timeInterval / 24);
        project.diffTimeUnit = this.timeUnit.day;
      } else if (project.timeInterval >= 168 && project.timeInterval < 730) {
        project.timeInterval = Math.floor(project.timeInterval / 168);
        project.diffTimeUnit = this.timeUnit.week;
      } else if (project.timeInterval >= 730 && project.timeInterval < 8760) {
        project.timeInterval = Math.floor(project.timeInterval / 730);
        project.diffTimeUnit = this.timeUnit.month;
      } else if (project.timeInterval >= 8760) {
        project.timeInterval = Math.floor(project.timeInterval / 8760);
        project.diffTimeUnit = this.timeUnit.year;
      }
    });
  }

  //--------------------------------------------//

  toggleNewProject() {
    const count = this.projects.length + 1;
    this.projectAction = 'create';
    this.actionType = 'create';
    this.isCreateProject = true;
    this.project_name = `${this.projectAuto} ${count}`;
    this.imgSrc = '../../../assets/icons/v3/Rectangle 2777.png';
    this.currentType = 'conversation';
  }

  /** Create project and navigate user to Conversation page */
  onCreate() {
    if (this.projects.length >= this.maxProject) {
      this.dialog.open(AlertProjFullComponent);
    } else {
    }

    const count = this.projects.length + 1;
    const project_name = `${this.projectAuto} ${count}`;
    const workspace_id = this._globalFunc.generateID();
    const type = 'conversation';
    this.project_name = project_name;

    // Send to API
    const temp: InsertPayload = {
      workspace_id: workspace_id,
      workspace: project_name,
      type_workspace: type,
    };

    this.isLoading = true;
    this._workspace
      .insertWorkspace(temp)
      .pipe(
        catchError((err) => {
          this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
          this.isLoading = false;
          return err;
        }),
      )
      .subscribe((resp) => {
        this.isLoading = false;
        if (resp?.message === 'insert work space success') {
          this.projects.unshift({
            workspace_id,
            name: project_name,
            picture:
              'https://images-ext-1.discordapp.net/external/0qQzMrsYKoBNvWTu9UzB8xXBeGg4mi09QeKIkDj3dPs/https/botnoi-voice.s3.ap-southeast-1.amazonaws.com/image/workspace/U7b1f00b4e1502093a3327e1743150bf5_%25E0%25B9%2582%25E0%25B8%259B%25E0%25B8%25A3%25E0%25B9%2580%25E0%25B8%2588%25E0%25B8%2584%2B2.jpg?width=393&height=245',
            recent_use: new Date().toLocaleString(),
            speaker_list: [],
            isEdit: false,
            type_workspace: type,
            speakerImg: null,
            timeInterval: 0,
            isAlertDelete: false,
            diffTimeUnit: '',
          });
          this.isCreateProject = false;
          this.onSelect(workspace_id, type, project_name);
        } else if (resp?.message === 'Exceeded the workspace limit') {
          this.fetchGetWorkspace();
        } else {
          this._dialog.info(resp?.message);
        }

        // Update final workspace data
        this._workspace.updateWorkspace(this.projects);
      });
  }

  closeNewProject() {
    this.isCreateProject = false;
    this.imgSrc = '../../../assets/icons/v3/Rectangle 2777.png';
  }

  closeAlert() {
    this.isAlert = false;
  }

  onSubmit() {
    const name = this.project_name;
    const type = this.currentType;
    const checkDuplicate = this.projects.filter((item) => item.name === name);
    // else
    if (this.projectAction === 'edit') {
      const project = this.projects[this.selectedProject];
      //Edit name
      if (this.actionType === 'name') {
        const newName = this.project_name;
        const checkDuplicate = this.projects.filter(
          (item) => item.name === newName,
        );
        if (checkDuplicate.length) {
          this.alert = this.text.alert.duplicate;
          this.isAlert = true;
        } else if (newName.length === 0) {
          this.alert = this.text.alert.blank;
          this.isAlert = true;
        } else if (newName === project.name) {
          this.alert = this.text.alert.sameName;
          this.isAlert = true;
        } else {
          const body = {
            workspace_id: project.workspace_id,
            edit_name: newName,
          };
          this.editWorkspace(body);
          project.name = newName;
          project.recent_use = new Date().toLocaleString();
          this.getTimeInterval();
          this.isCreateProject = false;
          this.getRecentProject();
        }
      }
      //Edit Img
      else if (this.actionType === 'img') {
        if (this.imgSrc === '../../../assets/icons/v3/Rectangle 2777.png') {
          this.isCreateProject = false;
        } else {
          const newImg = this.imgSrc;
          const body = {
            workspace_id: project.workspace_id,
            edit_picture: newImg,
          };
          this.editWorkspace(body);
          project.picture = newImg;
          this.getRecentProject();
          this.getTimeInterval();
          this.isCreateProject = false;
          this.getRecentProject();
        }
      }

      // Update final workspace data to global stored variable
      this._workspace.updateWorkspace(this.projects);
    }
  }

  onChange(e: any) {
    e.preventDefault();
    if (e.target.value === 'conver') {
      this.currentType = 'conversation';
    } else if (e.target.value === 'book') {
      this.currentType = 'book';
    }
  }

  onSelect(id: string, type: any, name?: string) {
    if (type === 'conversation') {
      this.router.navigate(['tts/conversation'], {
        queryParams: { id, name },
      });
    } else if (type === 'book') {
      this.router.navigate(['tts/book'], {
        queryParams: { id, name },
      });
    }
  }

  onEditName(project: any, index: number) {
    //close dropdown
    this.projects[index].isEdit = false;
    this.selectedProject = index;

    //open popup
    const dialog = this.dialog.open(AlertEditNameComponent, {
      data: { type: 'edit' },
    });
    dialog.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.isLoading = true;
          const body = {
            workspace_id: project.workspace_id,
            edit_name: res,
          };

          this.editWorkspace(body);

          this.projects[index].name = res;
          this.getRecentProject();
        }
      },
    });
  }

  onEditImg(project: any, index: any) {
    //close dropdown
    this.projects[index].isEdit = false;
    this.selectedProject = index;

    const dialog = this.dialog.open(AlertEditPicComponent);
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.isLoading = true;
        const body = {
          workspace_id: project.workspace_id,
          edit_picture: res,
        };
        this.editWorkspace(body);

        project.picture = res;
        this.getRecentProject();
      }
    });
  }

  onDeleteDialog(id: string, i: any, selector: string) {
    const dialog = this.dialog.open(AlertFlexComponent, {
      data: { text: this.dialogText, icon: 'danger', icon_color: '#FF5252' },
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.onDelete(id, i, selector);
      }
    });
  }

  get_dataChangeLanguage(temp: string) {
    if (temp == 'TH') {
      this.text = TH.workspaceObj;
    } else if (temp == 'EN') {
      this.text = EN.workspaceObj;
    }
    this.lang = temp;
    this.getdataInfo();
    this.getTimeInterval();
  }

  getdataInfo() {
    this.createProject = this.text.createProject;
    this.insertImage = this.text.insertImage;
    this.projectName = this.text.projectName;
    this.placeholder = this.text.placeholder;
    this.type = this.text.type;
    this.createBook = this.text.createBook;
    this.createConversation = this.text.createConversation;
    this.cancel = this.text.cancel;
    this.submit = this.text.submit;
    this.myProject = this.text.project;
    this.editProject = this.text.editProject;
    this.lastChange = this.text.lastChange;
    this.recentProject = this.text.recentProject;
    this.changeName = this.text.changeName;
    this.changeImage = this.text.changeImage;
    this.deleteProject = this.text.deleteProject;
    this.deleteAlert = this.text.deleteAlert;
    this.confirm = this.text.confirm;
    this.timeUnit = this.text.timeUnit;
    this.projectAuto = this.text.projectAuto;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._unsub.complete();
  }
}
