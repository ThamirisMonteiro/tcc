package timeutil

import (
	"errors"
	"extranet/core/country"
	"github.com/erichnascimento/golib/runtime"
	"strconv"
	"strings"
	"time"
)

var (
	BrazilLocation = loadBrazilLocation()

	ErrLocationNotFound = "location not found"
)

func MustParseTime(layout, value string) time.Time {
	t, err := time.Parse(layout, value)
	if err != nil {
		panic(err)
	}
	return t
}

func MustParseJSONDateTimeUTC(value string) time.Time {
	return MustParseTime(time.RFC3339, value)
}

func MustFormatDateTime(value time.Time) string {
	return value.Format(time.RFC3339Nano)
}

func NowInBrazil() time.Time {
	base := runtime.Now()
	return base.In(BrazilLocation)
}

// ParseDateAtBrazil parses date formatted as YYYY-mm-dd to time at Brazil
func ParseDateAtBrazil(date string) (time.Time, error) {
	return time.ParseInLocation("2006-01-02", date, BrazilLocation)
}

// MustParseDateAtBrazil parses date formatted as YYYY-mm-dd to time at Brazil
// causing panic if any error occurs
func MustParseDateAtBrazil(date string) time.Time {
	t, err := ParseDateAtBrazil(date)
	if err != nil {
		panic(err)
	}
	return t
}

// ZeroTime returns a time.Time considering 00:00:00 in the location
func ZeroTime(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

func loadBrazilLocation() *time.Location {
	location, err := time.LoadLocation("America/Fortaleza")
	if err != nil {
		panic(err)
	}
	return location
}

func toMinutes(hour, minute int) int {
	return hour*60 + minute
}

func inRange(now int, begin int, end int) bool {
	return begin <= now && now <= end
}

func MustBetweenTime(timeToCheck time.Time, rangeToCheck string, location *time.Location) bool {
	bt, err := betweenTime(timeToCheck, rangeToCheck, location)
	if err != nil {
		panic(err)
	}
	return bt
}

func betweenTime(timeToCheck time.Time, rangeToCheck string, location *time.Location) (bool, error) {
	timeToCheckInLocation := timeToCheck.In(location)
	timeToSend := strings.Split(rangeToCheck, "-")

	hourBegin, err := strconv.Atoi(timeToSend[0][0:2])
	if err != nil {
		return false, err
	}

	minuteBegin, err := strconv.Atoi(timeToSend[0][3:5])
	if err != nil {
		return false, err
	}

	hourEnd, err := strconv.Atoi(timeToSend[1][0:2])
	if err != nil {
		return false, err
	}

	minuteEnd, err := strconv.Atoi(timeToSend[1][3:5])
	if err != nil {
		return false, err
	}

	minutesBegin := toMinutes(hourBegin, minuteBegin)
	minutesEnd := toMinutes(hourEnd, minuteEnd)
	minutesTimeToCheck := toMinutes(timeToCheckInLocation.Hour(), timeToCheckInLocation.Minute())

	if minutesEnd < minutesBegin {
		return inRange(minutesTimeToCheck, 0, minutesEnd) || inRange(minutesTimeToCheck, minutesBegin, 1440), nil
	}
	return inRange(minutesTimeToCheck, minutesBegin, minutesEnd), nil
}

//TODO create test
func LocationFromCountryCode(code country.Code) (*time.Location, error) {
	if code.IsBrazil() {
		return BrazilLocation, nil
	}

	return nil, errors.New(ErrLocationNotFound)
}
