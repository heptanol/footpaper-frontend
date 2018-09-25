import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FootApiService} from '../shared/foot-api.service';
import {Competition, CompetitionConfig} from '../shared/model';
import {Subscription} from 'rxjs/Subscription';
import {catchError, tap} from 'rxjs/operators';
import {CommonService} from '../shared/common.service';
import {Cups} from '../shared/enum';

@Component({
  selector: 'app-champions-leagues',
  templateUrl: './champions-leagues.component.html',
  styleUrls: ['./champions-leagues.component.scss']
})
export class ChampionsLeaguesComponent implements OnInit, OnDestroy {

  competition: Competition;
  cometitionConfig: CompetitionConfig;
  matchDay: number;
  subscribtions: Subscription[] = [];
  cups = Cups;
  loading = false;
  error = false;
  constructor(
    private apiService: FootApiService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.subscribtions.push(this.route.params.subscribe(param => {
      this.cometitionConfig = Object.values(this.cups).find((val) => val.path === param.cupPath);
      this.getCompetition(this.cometitionConfig.id);
    }));
  }

  getCompetition(competitionId): void {
    this.loading = true;
    this.subscribtions.push(this.apiService.getCompetitionStandings(competitionId)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
          this.loading = false;
          this.error = true;
          this.commonService
            .openSnackBar('Un problème est survenue lors du chargement', 'fermer');
          return err;
        })
        )
      .subscribe(data => {
        this.competition = <Competition>data;
      }));
  }

  ngOnDestroy() {
    this.subscribtions.forEach(sub => sub.unsubscribe());
  }
}
