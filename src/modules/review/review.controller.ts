import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';
import { ReviewFactoryService } from './factory';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/guard';
import { globalReviewDto } from './dto/create-review.dto';


@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService, private readonly reviewFactoryService: ReviewFactoryService) { }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER, Role.PROVIDER)
  @Post("global-review")
  async globalReview(@Body() globalReviewDto: globalReviewDto, @Request() req: any) {
    const review = this.reviewFactoryService.globalReview(globalReviewDto, req.user._id);
    const result = await this.reviewService.globalReview(review);
    return result;
  }

  @Get("/global-reviews")
  async getGlobalReviews() {
    const result = await this.reviewService.getGlobalReviews();
    return result;
  }

}
