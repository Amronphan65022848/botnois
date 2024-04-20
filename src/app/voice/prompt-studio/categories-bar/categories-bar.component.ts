import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, ViewChildren, HostBinding, HostListener, Renderer2, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-categories-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './categories-bar.component.html',
  styleUrl: './categories-bar.component.scss',
  animations: [
    trigger('fadeSlideInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(0)' }),
        animate('200ms ease-out')
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(5%)' }))
      ])
    ])
  ]

})
export class CategoriesBarComponent implements OnInit{
  selectedCategoryId: string = 'cat-2';
  categoryName: string = 'ประโยคเปิดคลิป';
  @Output() topicSelected = new EventEmitter<string>();
  isOpen: boolean = false;

  @HostBinding('@fadeSlideInOut') animation: any;
  @ViewChild('categoriesContainer', { static: true }) categoriesContainer: ElementRef;

  screenSize = window.innerWidth;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.handleClick(this.categoryName,this.selectedCategoryId);


  }

  CategoryObj = {
    topicList: [
      { label: 'ขายของโฆษณา', value: 'sales caption' },
      { label: 'คำอธิบายสินค้า', value: 'Product description' },
      { label: 'สอนใช้ผลิตภัณฑ์', value: 'Teach how to use the product' },
      { label: 'ประโยคเปิดคลิป', value: 'Clip opening sentence' },
      { label: 'สคริปต์วิดีโอ', value: 'Video script' },
      { label: 'เขียนแคปชัน', value: 'Social captions' },
      { label: 'เล่าเรื่องผี', value: 'Ghost stories' },
      { label: 'เล่านิทาน', value: 'Stories' },
    ],
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenSize = window.innerWidth;
    if (this.screenSize > 320 && this.isOpen) {

      this.isOpen = false;
    }
  }
  handleClick(categoryName: string, categoryId: string): void {
    this.selectedCategoryId = categoryId; // Store the ID of the clicked category
    this.categoryName = categoryName;
    // console.log("Category selected:", categoryName);

    this.handleFoundTopic(categoryName);
  }

  handleFoundTopic(label: string): void {

    const foundTopic = this.CategoryObj.topicList.find(topic => topic.label === label);
    if (foundTopic) {
      this.topicSelected.emit(foundTopic.value);
      // console.log("Topic selected:", foundTopic.value);
    } else {
      console.error("Topic not found for label:", label);
    }
  }


  isSelected(categoryId: string): boolean {
    return this.selectedCategoryId === categoryId; // Check if the category is selected
  }

  onButtonClick() {
    this.isOpen = !this.isOpen;
    this.animation = this.isOpen ? 'in' : 'out';

  }
  // handleClick(selectedItemId: number,catName:string): void {

  //   const selectedIndex = this.categories.findIndex(item => item.id === selectedItemId);
  //   if (selectedIndex !== -1) {

  //     const reorderedCategories = [
  //       ...this.categories.slice(selectedIndex),
  //       ...this.categories.slice(0, selectedIndex)
  //     ];


  //     this.categories = reorderedCategories;


  //     this.selectedCategoryId = selectedItemId;
  //     this.categoryName = catName;
  //     console.log(catName);

  //   }
  // }

  // isSelected(categoryId: number): boolean {
  //   return !!this.categories.find(c => c.id === categoryId && c.selected);
  // }






}
