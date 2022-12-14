import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/shared/album.model';
import { MusicListService } from '../music-list.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  @Input() album: Album;
  @Input() index: number;

  constructor(private mlService: MusicListService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  // onEdit(){
  //   this.router.navigate(['edit'], {relativeTo: this.route})
  // }

  onDeleteAlbum(){
    this.mlService.deleteAlbum(this.index);
    this.router.navigate(['/musiclist']);
  }

}
