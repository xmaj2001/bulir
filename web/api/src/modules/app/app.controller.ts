import { Get, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "@common/decorators/public.decorator";
import { SkipThrottle } from "@nestjs/throttler";

@Controller("")
@Public()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  health(): { status: string } {
    return { status: "OK" };
  }
}
