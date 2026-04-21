import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, reviewSchema } from '@models/reviews/review.schema';
import { ReviewRepository } from '@models/reviews/reviews.repository';
import { ReviewFactoryService } from './factory';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Review.name, schema: reviewSchema }
  ])],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, ReviewFactoryService],
})
export class ReviewModule {}
