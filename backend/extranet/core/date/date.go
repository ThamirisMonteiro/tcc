package date

import (
	"extranet/core/timeutil"
	"fmt"
	"github.com/fxtlabs/date"
	"strconv"
	"time"
)

var (
	Empty = Date{}
)

type Date struct {
	date date.Date
}

func (d Date) Date() (year int, month time.Month, day int) {
	return d.date.Date()
}

func (d Date) Add(days int) Date {
	return Date{
		date: d.date.Add(days),
	}
}

func (d Date) Sub(u Date) (day int) {
	return d.date.Sub(u.date)
}

func (d Date) Equal(date Date) bool {
	return d.date.Equal(date.date)
}

func (d Date) After(date Date) bool {
	return d.date.After(date.date)
}

func (d Date) IsZero() bool {
	return d.date.IsZero()
}

func (d Date) AfterOrEqual(date Date) bool {
	return d.Equal(date) || d.After(date)
}

func (d Date) String() string {
	year, month, day := d.Date()
	return fmt.Sprintf("%04d-%02d-%02d", year, month, day)
}

func (d Date) Time(loc *time.Location) time.Time {
	year, month, day := d.Date()
	return time.Date(year, month, day, 0, 0, 0, 0, loc)
}

func (d Date) TimeAtBrazil() time.Time {
	return d.Time(timeutil.BrazilLocation)
}

func ParseDateYYYYMMDD(strDate string) (Date, error) {
	if len(strDate) != 10 {
		return Empty, fmt.Errorf("'%s' is not a valid strDate. The expected format is yyyy-mm-dd or yyyy/mm/dd", strDate)
	}
	year, err := strconv.Atoi(strDate[0:4])
	if err != nil {
		return Empty, err
	}
	month, err := strconv.Atoi(strDate[5:7])
	if err != nil {
		return Empty, err
	}
	day, err := strconv.Atoi(strDate[8:10])
	if err != nil {
		return Empty, err
	}
	return New(year, time.Month(month), day), nil
}

func NewAtBrazil(year int, month time.Month, day int) Date {
	t := time.Date(year, month, day, 0, 0, 0, 0, timeutil.BrazilLocation)
	return Date{
		date: date.NewAt(t),
	}
}

func NewDateFromTime(t time.Time, loc *time.Location) Date {
	lt := t.In(loc)
	return New(lt.Year(), lt.Month(), lt.Day())
}

func New(year int, month time.Month, day int) Date {
	return Date{
		date: date.New(year, month, day),
	}
}
