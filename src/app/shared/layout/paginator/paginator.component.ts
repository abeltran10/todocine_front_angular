import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnChanges {

  @Input() activePage = 1;       // página actual
  @Input() totalPages = 1;       // total de páginas
  @Output() pageChange = new EventEmitter<number>();

  paginationNumbers: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePages();
  }

  private calculatePages() {
    this.paginationNumbers = [];

    const showMax = 10;
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > showMax) {
      startPage = Math.max(this.activePage - Math.floor(showMax / 2), 1);
      endPage = startPage + showMax - 1;
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = endPage - showMax + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      this.paginationNumbers.push(i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.activePage) {
      this.pageChange.emit(page);
    }
  }

  goFirst() { this.goToPage(1); }
  goPrev() { this.goToPage(this.activePage - 1); }
  goNext() { this.goToPage(this.activePage + 1); }
  goLast() { this.goToPage(this.totalPages); }

}
