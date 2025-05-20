import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

interface MongoPost {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number, searchQuery?: string) {
    let queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    if (searchQuery) {
      queryParams += `&search=${searchQuery}`;
    }
    
    this.http
      .get<{ message: string, posts: any[], maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
                comments: post.comments || [],
                reactions: post.reactions || {},
                userReaction: post.userReaction || null
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        console.log(transformedPostData); // Log the transformed data
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{message: string, post: Post}>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`);
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: '' // The backend will set this from the token
      };
    }
    this.http
      .put<{ message: string, imagePath: string }>(
        "http://localhost:3000/api/posts/" + id,
        postData
      )
      .subscribe(() => {
        this.router.navigate(["/"]);
      });
  }

  addComment(postId: string, text: string) {
    return this.http.post<{ message: string; comment: any }>(
      `http://localhost:3000/api/posts/${postId}/comments`,
      { text }
    );
  }

  deleteComment(postId: string, commentId: string) {
    return this.http.delete<{ message: string }>(
      `http://localhost:3000/api/posts/${postId}/comments/${commentId}`
    );
  }

  reactToPost(postId: string, type: string) {
    return this.http.post<{ message: string; reactions: any; userReaction: string | null }>(
      `http://localhost:3000/api/posts/${postId}/reactions`,
      { type }
    );
  }

  reactToComment(postId: string, commentId: string, type: string) {
    return this.http.post<{ message: string; reactions: any; userReaction: string | null }>(
      `http://localhost:3000/api/posts/${postId}/comments/${commentId}/reactions`,
      { type }
    );
  }
} 