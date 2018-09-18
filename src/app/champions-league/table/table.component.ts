import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FootApiService} from '../../shared/foot-api.service';
import {Competition} from '../../shared/model';
import {Subscription} from 'rxjs/Subscription';
import {catchError, map, tap} from 'rxjs/operators';
import {CommonService} from '../../shared/common.service';

@Component({
  selector: 'app-table-cl',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableClComponent implements OnInit, OnDestroy {

  @Input()competition: Competition;
  tables: any[];
  subscribtion: Subscription;
  matchDay: number;
  loading = false;
  error = false;
  constructor(
    private apiService: FootApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getData(this.competition.competition.id);
  }

  getData(competitionId) {
    this.matchDay = (this.competition.season.currentMatchday > 6) ? 6 : this.competition.season.currentMatchday;
    this.loading = true;
    this.subscribtion = this.apiService.getCompetitionTable(competitionId, this.matchDay)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
          this.loading = false;
          this.error = true;
          this.commonService
            .openSnackBar('Un problème est survenue lors du chargement', 'fermer');
          return err;
        })
      ).pipe(
        map(data => data)
      )
      .subscribe(data => {
        this.tables = data;
      });
  }

  getGroupLabel(nb): string {
    const alph = 'ABCDEFGH';
    return alph[nb];
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

}
