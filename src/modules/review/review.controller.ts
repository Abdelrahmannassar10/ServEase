import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';
import { ReviewFactoryService } from './factory';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/guard';
import { globalReviewDto, RequestReviewDto } from './dto/create-review.dto';


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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post("request-review")
  async requestReview(@Body() requestReviewDto:RequestReviewDto ,@Request() req: any) {
    const review = this.reviewFactoryService.requestReview(requestReviewDto ,req.user._id);
    const result = await this.reviewService.requestReview(review);
    return result;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER, Role.ADMIN, Role.CUSTOMER)
  @Get("/provider-reviews/:providerId")
  async  getProviderReviews(@Param("providerId") providerId:any) {
    const result = await this.reviewService.getProviderReviews(providerId);
    return result;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get("request-reviews")
  async getRequestReviews() {
    const result = await this.reviewService.getRequestReviews();
    return result;
  }
}
