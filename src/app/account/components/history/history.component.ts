import { Component, OnInit, ViewChild, } from '@angular/core';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { AccountAPIService } from '../../services/account-api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';


interface HistoryData {
  point_decrease: Array<any>;
  point_increase: Array<any>;
  user_id: string;

}
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  text = null
  selectedDate: Date;
  historyData: HistoryData;
  dateOptions: Date[];
  displayedColumns: string[] = ['details', 'tag', 'point', 'time'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _accountAPI: AccountAPIService,
    private _gfunc: GlobalFunctionService,
    private _language: ChangeLanguageService,
  ) {
  }
  ngOnInit(): void {
    this._language.language.subscribe(
      resp => {
        if (resp) {
          this.text = language[resp].historyPageObj
        }
      }
    )

    this.getHistoryPoint()

  }

  get combinedPointData() {
    const decreaseArray = this.historyData.point_decrease || [];
    const increaseArray = this.historyData.point_increase || [];

    const combinedArray = [
      ...decreaseArray.map(item => ({ ...item, tag: 'point_decrease' })),
      ...increaseArray.map(item => ({ ...item, tag: 'point_increase' }))
    ];

    return this.sortByTime(combinedArray);
  }

  sortByTime(array: any[]): any[] {
    if (!array || array.length === 0) {
      return array;
    }
    return array.slice().sort((a, b) => {
      const timeA = new Date(a.actual_time).getTime();
      const timeB = new Date(b.actual_time).getTime();

      return timeB - timeA; // Sort in descending order
    });
  }






  getHistoryPoint() {
    this._accountAPI.getHistoryPoint().subscribe(
      (res: any) => {
        this.historyData = res.data;

        // Get the data and set up the dataSource
        this.dataSource = new MatTableDataSource(this.combinedPointData);
        this.dataSource.paginator = this.paginator;

        const uniqueDatesSet = new Set(
          this.combinedPointData.map((item) => new Date(item.actual_time).toDateString())
        );
        // Convert the Set back to an array and parse each string to Date
        this.dateOptions = Array.from(uniqueDatesSet).map((dateString) => new Date(dateString));
        // Optionally, you can set an initial selectedDate
        if (this.dateOptions.length > 0) {
          this.selectedDate = this.dateOptions[0];
        }
      }
    );
  }
  onDateChange(selectedDate: Date): void {
    // Filter data based on the selected date and later
    const filteredData = this.combinedPointData.filter((item) => {
      // Extract only the date part from the actual_time
      const itemDate = new Date(item.actual_time);
      const itemDateWithoutTime = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate()
      );

      // Compare dates without considering time
      return itemDateWithoutTime.getTime() <= selectedDate.getTime();
    });

    // Update the MatTableDataSource with the filtered data
    this.dataSource.data = filteredData;
  }


}
