import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { useForm } from "react-hook-form";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";

interface ForecaseData {
  month: string;
  yhat: number;
  yhat_confidence: [number, number];
  yhat_lower: number;
  yhat_upper: number;
}

const chartConfig = {
  yhat: {
    label: "Forecast",
    color: "hsl(var(--chart-1))",
  },
  yhat_confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ForecastChart({
  data,
  avg,
}: {
  data: ForecaseData[];
  avg: number;
}) {
  return (
    <Card className="max-w-[800px]">
      <CardHeader>
        <CardTitle>Grafica de los proximos 7 dias</CardTitle>
        <CardDescription>
          Promedio de llamadas al dias: <b>{avg.toFixed(2)}</b>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="yhat"
              type="natural"
              fill="var(--color-yhat)"
              fillOpacity={0.4}
              stroke="var(--color-yhat)"
              dot={false}
            />
            <Area
              dataKey="yhat_confidence"
              type="natural"
              stroke="none"
              fill="var(--color-yhat_confidence)"
              fillOpacity={0.1}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-start gap-2 w-full text-sm">
          <div className="gap-2 grid">
            <div className="flex items-center gap-2 font-medium leading-none">
              Prediccion con rango de confianza
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

const formSchema = z.object({
  date: z.date({ required_error: "Requerido!" }),
});

export function ProfileForm() {
  const [forecast, setForecast] = useState<ForecaseData[]>();
  const [avg, setAvg] = useState<number>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const host = import.meta.env.PUBLIC_API_HOST;
    const res = await fetch(`${host}/predict`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ date: format(values.date, "yyyy-MM-dd") }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    setAvg(data.avg[0]);
    setForecast(
      Object.keys(data.ds).map((key) => ({
        month: new Date(data.ds[key]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        yhat: data.yhat[key] as number,
        yhat_confidence: [
          data.yhat_lower[key] as number,
          data.yhat_upper[key] as number,
        ],
        yhat_lower: data.yhat_lower[key] as number,
        yhat_upper: data.yhat_upper[key] as number,
        avg: data.avg,
      }))
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row space-x-4 mb-6"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                        <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className="flex items-end">
            <Button type="submit">Proyectar</Button>
          </FormItem>
        </form>
      </Form>
      {forecast && avg && <ForecastChart data={forecast} avg={avg} />}
    </>
  );
}
