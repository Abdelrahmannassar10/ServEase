import { Body, Controller, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';
import { ReviewFactoryService } from './factory';


@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService,private readonly reviewFactoryService : ReviewFactoryService) {}

  @Roles(Role.CUSTOMER,Role.PROVIDER)
  @Post("/global-review")
  async globalReview(@Body() globalReviewDto :any){
    const review  = this.reviewFactoryService.globalReview(globalReviewDto);
    const result = await this.reviewService.globalReview(review);
    return result;
  }
 
}
