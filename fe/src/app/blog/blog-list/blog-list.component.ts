import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  longText = 'asdas dasd asd asdsadasdas dasasdas dasdasdas das'
  longText2 = 'asdas dasd asd asdsadasdas dasasdas dasdasdas dasdasd asdas asadas dasdasdasd asdasdasdas dasdasda asdassdsd sdsdsdsds'
  constructor() { }

  ngOnInit(): void {
  }

}
