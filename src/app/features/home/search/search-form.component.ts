import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-form.component.html'
})
export class SearchFormComponent {

  text = '';

  @Output() search = new EventEmitter<{text: string, page: number}>();

  onSearch() {
    if (!this.text.trim()) return;

    this.search.emit({text: this.text, page: 1});
    this.text = '';
  }
}
