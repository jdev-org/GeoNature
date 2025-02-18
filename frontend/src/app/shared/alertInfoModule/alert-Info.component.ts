import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SyntheseDataService } from '@geonature_common/form/synthese-form/synthese-data.service';
import { CommonService } from '@geonature_common/service/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'pnx-alert-info',
  templateUrl: 'alert-Info.component.html',
  styleUrls: ['alert-Info.component.scss'],
})

/**
 * Usefull (modal-body) optional component with form to create, read or delete an alert report type
 * Only validator could delete an alert. Everybody could create one.
 * Ref. config : ALERT_MODULES<Array>
 */
export class AlertInfoComponent implements OnInit, OnChanges {
  @Input() idSynthese: number;
  @Input() alert: any;
  @Output() changeVisibility = new EventEmitter();
  public moduleSub: any;
  public userCruved: any;
  public alertForm: FormGroup;
  public canChangeAlert = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _syntheseDataService: SyntheseDataService,
    public moduleService: ModuleService
  ) {
    // a simple form
    this.alertForm = this._formBuilder.group({
      content: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.setCruved();
  }
  /**
   * Display delete alert button for validator only
   */
  setCruved() {
    this.moduleSub = this.moduleService.currentModule$
      // filter undefined or null
      .pipe(filter((mod) => mod))
      .subscribe((mod) => {
        this.userCruved = mod.cruved;
      });
  }
  ngOnChanges() {
    this.canChangeAlert = this.userCruved?.V && this.userCruved?.V > 0 && !isEmpty(this.alert);
  }
  /**
   * Create new alert with /reports GET service
   */
  createAlert() {
    this._syntheseDataService
      .createReport({
        type: 'alert',
        item: this.idSynthese,
        content: this.alertForm.get('content').value,
      })
      .subscribe((success) => {
        this._commonService.translateToaster('success', 'Signalement sauvegardé !');
        this.openCloseAlert();
      });
  }
  /**
   * Manage alert form visibility
   */
  openCloseAlert() {
    this.changeVisibility.emit();
  }
  /**
   * Remove alert with /reports DELETE service
   */
  deleteAlert() {
    this._syntheseDataService.deleteReport(this.alert.id_report).subscribe(() => {
      this.alertForm.reset();
      this.openCloseAlert();
    });
  }
}
