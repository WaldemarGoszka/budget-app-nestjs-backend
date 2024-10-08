import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthorGuard } from 'src/guard/author.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    return this.transactionService.create(createTransactionDto, +req.user.id);
  }

  // http://localhost:3000/api/transactions/income/find
  // http://localhost:3000/api/transactions/expense/find
  @UseGuards(JwtAuthGuard)
  @Get(':type/find')
  findAllByType(@Req() req, @Param('type') type: string) {
    return this.transactionService.findAllByType(+req.user.id, type);
  }

  // http://localhost:3000/api/transactions/pagination?page=1&limit=1
  @UseGuards(JwtAuthGuard)
  @Get('pagination')
  findAllWithPagination(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    return this.transactionService.findAllWithPagination(
      +req.user.id,
      +page,
      +limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.transactionService.findAll(+req.user.id);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Get(':type/:id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Patch(':type/:id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Delete(':type/:id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
