import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GraphqlInterceptor } from "./graphql/graphql.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	if (process.env.NODE_ENV === "development")
		app.useGlobalInterceptors(new GraphqlInterceptor());
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
