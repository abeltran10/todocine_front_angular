import { Component, output, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {

  activePage = input<number>(1);       // página actual
  totalPages = input<number>(1);       // total de páginas
  pageChange = output<number>();

  
  // Usamos un computed signal para calcular las páginas automáticamente
  paginationNumbers = computed(() => {
    const pages: number[] = [];
    const current = this.activePage();
    const total = this.totalPages();
    const showMax = 10;
    
    let startPage = 1;
    let endPage = total;

    if (total > showMax) {
      startPage = Math.max(current - Math.floor(showMax / 2), 1);
      endPage = startPage + showMax - 1;
      if (endPage > total) {
        endPage = total;
        startPage = endPage - showMax + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  goToPage(page: number) {
    const total = this.totalPages();
    const current = this.activePage();

    if (page >= 1 && page <= total && page !== current) {
      this.pageChange.emit(page);
    }
  }

  goFirst() { this.goToPage(1); }
  goPrev() { this.goToPage(this.activePage() - 1); }
  goNext() { this.goToPage(this.activePage() + 1); }
  goLast() { this.goToPage(this.totalPages()); }
}
