-- Declare the JSON input
DECLARE @json NVARCHAR(MAX) = '
[
  {
    "id": "CH-09",
    "neighbours": [
      "CH-08",
      "CH-07",
      "AT-69",
      "AT-68",
      "AT-67",
      "DE-88"
    ]
  },
  {
    "id": "CH-08",
    "neighbours": [
      "CH-09",
      "CH-07",
      "CH-06",
      "CH-05",
      "DE-88",
      "DE-79",
      "DE-78"
    ]
  },
  {
    "id": "CH-07",
    "neighbours": [
      "CH-09",
      "CH-08",
      "CH-06",
      "AT-68",
      "AT-67",
      "AT-65",
      "AT-64",
      "IT-39",
      "IT-25",
      "IT-23",
      "DE-78"
    ]
  },
  {
    "id": "CH-06",
    "neighbours": [
      "CH-08",
      "CH-07",
      "CH-05",
      "CH-04",
      "CH-03",
      "IT-28",
      "IT-23",
      "IT-22",
      "IT-21",
      "IT-20"
    ]
  },
  {
    "id": "CH-05",
    "neighbours": [
      "CH-08",
      "CH-06",
      "CH-04",
      "DE-79"
    ]
  },
  {
    "id": "CH-04",
    "neighbours": [
      "CH-06",
      "CH-05",
      "CH-03",
      "CH-02",
      "FR-68",
      "DE-79"
    ]
  },
  {
    "id": "CH-03",
    "neighbours": [
      "CH-07",
      "CH-06",
      "CH-04",
      "CH-02",
      "CH-01",
      "IT-28",
      "IT-13",
      "IT-11"
    ]
  },
  {
    "id": "CH-02",
    "neighbours": [
      "CH-04",
      "CH-03",
      "CH-01",
      "FR-90",
      "FR-68",
      "FR-25"
    ]
  },
  {
    "id": "CH-01",
    "neighbours": [
      "CH-03",
      "CH-02",
      "IT-11",
      "FR-74",
      "FR-39",
      "FR-25",
      "FR-01"
    ]
  },
  {
    "id": "SE-98",
    "neighbours": [
      "SE-96",
      "SE-95",
      "NO-09",
      "NO-08",
      "FI-99",
      "FI-95",
      "FI-97"
    ]
  },
  {
    "id": "SE-97",
    "neighbours": [
      "SE-96",
      "SE-95",
      "SE-94"
    ]
  },
  {
    "id": "SE-96",
    "neighbours": [
      "SE-98",
      "SE-97",
      "SE-95",
      "SE-94",
      "SE-93",
      "NO-08"
    ]
  },
  {
    "id": "SE-95",
    "neighbours": [
      "SE-98",
      "SE-97",
      "SE-96",
      "FI-95"
    ]
  },
  {
    "id": "SE-94",
    "neighbours": [
      "SE-97",
      "SE-96",
      "SE-93"
    ]
  },
  {
    "id": "SE-93",
    "neighbours": [
      "SE-96",
      "SE-94",
      "SE-92",
      "SE-91",
      "SE-90",
      "NO-08"
    ]
  },
  {
    "id": "SE-92",
    "neighbours": [
      "SE-93",
      "SE-91",
      "SE-90",
      "NO-08"
    ]
  },
  {
    "id": "SE-91",
    "neighbours": [
      "SE-92",
      "SE-90",
      "SE-89",
      "SE-88",
      "SE-83",
      "NO-08",
      "NO-07"
    ]
  },
  {
    "id": "SE-90",
    "neighbours": [
      "SE-91"
    ]
  },
  {
    "id": "SE-89",
    "neighbours": [
      "SE-91",
      "SE-88",
      "SE-87"
    ]
  },
  {
    "id": "SE-88",
    "neighbours": [
      "SE-91",
      "SE-89",
      "SE-87",
      "SE-86",
      "SE-84",
      "SE-83"
    ]
  },
  {
    "id": "SE-87",
    "neighbours": [
      "SE-89",
      "SE-88",
      "SE-86",
      "SE-84"
    ]
  },
  {
    "id": "SE-86",
    "neighbours": [
      "SE-88",
      "SE-87",
      "SE-85",
      "SE-84",
      "SE-82"
    ]
  },
  {
    "id": "SE-85",
    "neighbours": [
      "SE-86"
    ]
  },
  {
    "id": "SE-84",
    "neighbours": [
      "SE-88",
      "SE-87",
      "SE-86",
      "SE-85",
      "SE-83",
      "SE-82",
      "SE-79",
      "SE-78",
      "NO-07",
      "NO-02"
    ]
  },
  {
    "id": "SE-83",
    "neighbours": [
      "SE-91",
      "SE-88",
      "SE-86",
      "SE-84",
      "NO-07"
    ]
  },
  {
    "id": "SE-82",
    "neighbours": [
      "SE-86",
      "SE-85",
      "SE-84",
      "SE-81",
      "SE-79"
    ]
  },
  {
    "id": "SE-81",
    "neighbours": [
      "SE-82",
      "SE-80",
      "SE-79",
      "SE-78",
      "SE-77",
      "SE-75",
      "SE-74",
      "SE-73"
    ]
  },
  {
    "id": "SE-80",
    "neighbours": [
      "SE-81"
    ]
  },
  {
    "id": "SE-79",
    "neighbours": [
      "SE-84",
      "SE-82",
      "SE-81",
      "SE-80",
      "SE-78",
      "SE-77",
      "NO-02"
    ]
  },
  {
    "id": "SE-78",
    "neighbours": [
      "SE-81",
      "SE-79",
      "SE-77",
      "SE-73",
      "SE-68",
      "NO-02"
    ]
  },
  {
    "id": "SE-77",
    "neighbours": [
      "SE-81",
      "SE-78",
      "SE-74",
      "SE-73",
      "SE-71",
      "SE-68"
    ]
  },
  {
    "id": "SE-76",
    "neighbours": [
      "SE-74",
      "SE-19",
      "SE-18"
    ]
  },
  {
    "id": "SE-75",
    "neighbours": [
      "SE-74"
    ]
  },
  {
    "id": "SE-74",
    "neighbours": [
      "SE-81",
      "SE-77",
      "SE-76",
      "SE-75",
      "SE-73",
      "SE-72",
      "SE-64",
      "SE-63",
      "SE-19"
    ]
  },
  {
    "id": "SE-73",
    "neighbours": [
      "SE-81",
      "SE-78",
      "SE-77",
      "SE-74",
      "SE-72",
      "SE-71",
      "SE-70",
      "SE-64",
      "SE-63"
    ]
  },
  {
    "id": "SE-72",
    "neighbours": [
      "SE-74",
      "SE-73",
      "SE-64",
      "SE-63"
    ]
  },
  {
    "id": "SE-71",
    "neighbours": [
      "SE-77",
      "SE-73",
      "SE-70",
      "SE-69",
      "SE-68",
      "SE-64"
    ]
  },
  {
    "id": "SE-70",
    "neighbours": [
      "SE-73",
      "SE-71",
      "SE-69"
    ]
  },
  {
    "id": "SE-69",
    "neighbours": [
      "SE-71",
      "SE-70",
      "SE-68",
      "SE-64",
      "SE-61",
      "SE-59",
      "SE-54"
    ]
  },
  {
    "id": "SE-68",
    "neighbours": [
      "SE-78",
      "SE-77",
      "SE-71",
      "SE-69",
      "SE-67",
      "SE-66",
      "SE-54",
      "NO-02"
    ]
  },
  {
    "id": "SE-67",
    "neighbours": [
      "SE-68",
      "SE-66",
      "NO-02",
      "NO-01"
    ]
  },
  {
    "id": "SE-66",
    "neighbours": [
      "SE-68",
      "SE-67",
      "SE-65",
      "SE-54",
      "SE-53",
      "SE-46",
      "SE-45",
      "NO-01"
    ]
  },
  {
    "id": "SE-65",
    "neighbours": [
      "SE-66"
    ]
  },
  {
    "id": "SE-64",
    "neighbours": [
      "SE-74",
      "SE-73",
      "SE-72",
      "SE-71",
      "SE-69",
      "SE-63",
      "SE-61",
      "SE-60",
      "SE-19",
      "SE-16-17",
      "SE-15"
    ]
  },
  {
    "id": "SE-63",
    "neighbours": [
      "SE-73",
      "SE-72",
      "SE-64"
    ]
  },
  {
    "id": "SE-62",
    "neighbours": []
  },
  {
    "id": "SE-61",
    "neighbours": [
      "SE-69",
      "SE-64",
      "SE-60",
      "SE-59",
      "SE-58",
      "SE-15",
      "SE-14"
    ]
  },
  {
    "id": "SE-60",
    "neighbours": [
      "SE-61"
    ]
  },
  {
    "id": "SE-59",
    "neighbours": [
      "SE-69",
      "SE-61",
      "SE-58",
      "SE-57",
      "SE-56",
      "SE-54"
    ]
  },
  {
    "id": "SE-58",
    "neighbours": [
      "SE-61",
      "SE-60",
      "SE-59"
    ]
  },
  {
    "id": "SE-57",
    "neighbours": [
      "SE-59",
      "SE-56",
      "SE-55",
      "SE-54",
      "SE-39",
      "SE-38",
      "SE-36",
      "SE-34",
      "SE-33"
    ]
  },
  {
    "id": "SE-56",
    "neighbours": [
      "SE-57",
      "SE-55",
      "SE-54",
      "SE-52",
      "SE-51",
      "SE-33"
    ]
  },
  {
    "id": "SE-55",
    "neighbours": [
      "SE-56"
    ]
  },
  {
    "id": "SE-54",
    "neighbours": [
      "SE-69",
      "SE-68",
      "SE-66",
      "SE-56",
      "SE-53",
      "SE-52"
    ]
  },
  {
    "id": "SE-53",
    "neighbours": [
      "SE-66",
      "SE-54",
      "SE-52",
      "SE-46",
      "SE-44"
    ]
  },
  {
    "id": "SE-52",
    "neighbours": [
      "SE-56",
      "SE-54",
      "SE-53",
      "SE-51",
      "SE-50",
      "SE-46",
      "SE-44"
    ]
  },
  {
    "id": "SE-51",
    "neighbours": [
      "SE-56",
      "SE-52",
      "SE-50",
      "SE-44",
      "SE-43",
      "SE-33",
      "SE-31"
    ]
  },
  {
    "id": "SE-50",
    "neighbours": [
      "SE-51",
      "SE-44"
    ]
  },
  {
    "id": "SE-47",
    "neighbours": [
      "SE-44"
    ]
  },
  {
    "id": "SE-46",
    "neighbours": [
      "SE-66",
      "SE-53",
      "SE-52",
      "SE-45",
      "SE-44"
    ]
  },
  {
    "id": "SE-45",
    "neighbours": [
      "SE-47",
      "SE-46",
      "SE-44",
      "NO-01"
    ]
  },
  {
    "id": "SE-44",
    "neighbours": [
      "SE-52",
      "SE-51",
      "SE-50",
      "SE-47",
      "SE-46",
      "SE-43",
      "SE-41-42"
    ]
  },
  {
    "id": "SE-43",
    "neighbours": [
      "SE-51",
      "SE-44",
      "SE-41-42",
      "SE-31"
    ]
  },
  {
    "id": "SE-41-42",
    "neighbours": [
      "SE-47",
      "SE-44",
      "SE-43"
    ]
  },
  {
    "id": "SE-39",
    "neighbours": [
      "SE-38"
    ]
  },
  {
    "id": "SE-38",
    "neighbours": [
      "SE-57",
      "SE-39",
      "SE-37",
      "SE-36"
    ]
  },
  {
    "id": "SE-37",
    "neighbours": [
      "SE-38",
      "SE-36",
      "SE-34",
      "SE-29",
      "SE-28"
    ]
  },
  {
    "id": "SE-36",
    "neighbours": [
      "SE-57",
      "SE-56",
      "SE-38",
      "SE-35",
      "SE-34",
      "SE-33",
      "SE-29",
      "SE-28"
    ]
  },
  {
    "id": "SE-35",
    "neighbours": [
      "SE-36",
      "SE-34"
    ]
  },
  {
    "id": "SE-34",
    "neighbours": [
      "SE-57",
      "SE-36",
      "SE-35",
      "SE-33",
      "SE-31",
      "SE-30",
      "SE-29",
      "SE-28"
    ]
  },
  {
    "id": "SE-33",
    "neighbours": [
      "SE-57",
      "SE-56",
      "SE-52",
      "SE-51",
      "SE-36",
      "SE-34",
      "SE-31"
    ]
  },
  {
    "id": "SE-31",
    "neighbours": [
      "SE-51",
      "SE-43",
      "SE-34",
      "SE-33",
      "SE-30",
      "SE-28",
      "SE-26"
    ]
  },
  {
    "id": "SE-30",
    "neighbours": [
      "SE-31"
    ]
  },
  {
    "id": "SE-29",
    "neighbours": [
      "SE-37",
      "SE-36",
      "SE-34",
      "SE-28",
      "SE-27",
      "SE-24"
    ]
  },
  {
    "id": "SE-28",
    "neighbours": [
      "SE-36",
      "SE-34",
      "SE-31",
      "SE-29",
      "SE-26",
      "SE-24"
    ]
  },
  {
    "id": "SE-27",
    "neighbours": [
      "SE-29",
      "SE-24",
      "SE-23"
    ]
  },
  {
    "id": "SE-26",
    "neighbours": [
      "SE-31",
      "SE-28",
      "SE-25",
      "SE-24",
      "SE-23",
      "SE-22"
    ]
  },
  {
    "id": "SE-25",
    "neighbours": [
      "SE-26"
    ]
  },
  {
    "id": "SE-24",
    "neighbours": [
      "SE-29",
      "SE-28",
      "SE-27",
      "SE-26",
      "SE-23",
      "SE-22",
      "SE-21"
    ]
  },
  {
    "id": "SE-23",
    "neighbours": [
      "SE-27",
      "SE-24",
      "SE-22",
      "SE-21"
    ]
  },
  {
    "id": "SE-22",
    "neighbours": [
      "SE-24",
      "SE-23"
    ]
  },
  {
    "id": "SE-21",
    "neighbours": [
      "SE-23"
    ]
  },
  {
    "id": "SE-19",
    "neighbours": [
      "SE-76",
      "SE-74",
      "SE-18",
      "SE-16-17",
      "SE-11-12"
    ]
  },
  {
    "id": "SE-18",
    "neighbours": [
      "SE-76",
      "SE-19",
      "SE-16-17",
      "SE-13",
      "SE-11-12"
    ]
  },
  {
    "id": "SE-16-17",
    "neighbours": [
      "SE-64",
      "SE-19",
      "SE-18",
      "SE-15",
      "SE-11-12"
    ]
  },
  {
    "id": "SE-15",
    "neighbours": [
      "SE-74",
      "SE-64",
      "SE-16-17"
    ]
  },
  {
    "id": "SE-14",
    "neighbours": [
      "SE-16-17",
      "SE-15",
      "SE-11-12"
    ]
  },
  {
    "id": "SE-13",
    "neighbours": [
      "SE-18",
      "SE-14",
      "SE-11-12"
    ]
  },
  {
    "id": "SE-11-12",
    "neighbours": [
      "SE-16-17",
      "SE-14",
      "SE-13"
    ]
  },
  {
    "id": "CZ-79",
    "neighbours": [
      "CZ-78",
      "CZ-77",
      "CZ-76",
      "CZ-75",
      "CZ-74",
      "CZ-68",
      "CZ-67",
      "CZ-66",
      "CZ-60-64",
      "PL-57",
      "PL-48",
      "PL-47"
    ]
  },
  {
    "id": "CZ-78",
    "neighbours": [
      "CZ-79",
      "CZ-77",
      "CZ-75",
      "CZ-74",
      "CZ-57",
      "CZ-56",
      "PL-57"
    ]
  },
  {
    "id": "CZ-77",
    "neighbours": [
      "CZ-78"
    ]
  },
  {
    "id": "CZ-76",
    "neighbours": [
      "CZ-79",
      "CZ-75",
      "CZ-69",
      "CZ-68",
      "SK-91",
      "SK-02",
      "SK-01"
    ]
  },
  {
    "id": "CZ-75",
    "neighbours": [
      "CZ-79",
      "CZ-78",
      "CZ-77",
      "CZ-76",
      "CZ-74",
      "CZ-73",
      "SK-02",
      "SK-01"
    ]
  },
  {
    "id": "CZ-74",
    "neighbours": [
      "CZ-79",
      "CZ-78",
      "CZ-77",
      "CZ-75",
      "CZ-73",
      "PL-48",
      "PL-47",
      "PL-44"
    ]
  },
  {
    "id": "CZ-73",
    "neighbours": [
      "CZ-75",
      "CZ-74",
      "SK-02",
      "SK-01",
      "PL-47",
      "PL-44",
      "PL-43"
    ]
  },
  {
    "id": "CZ-69",
    "neighbours": [
      "CZ-76",
      "CZ-68",
      "CZ-67",
      "CZ-66",
      "SK-91",
      "SK-90",
      "AT-22",
      "AT-21"
    ]
  },
  {
    "id": "CZ-68",
    "neighbours": [
      "CZ-79",
      "CZ-76",
      "CZ-69",
      "CZ-67",
      "CZ-66",
      "CZ-60-64",
      "SK-91"
    ]
  },
  {
    "id": "CZ-67",
    "neighbours": [
      "CZ-79",
      "CZ-78",
      "CZ-69",
      "CZ-68",
      "CZ-66",
      "CZ-60-64",
      "CZ-59",
      "CZ-58",
      "CZ-57",
      "CZ-56",
      "CZ-38",
      "CZ-37",
      "AT-38",
      "AT-37",
      "AT-21",
      "AT-20"
    ]
  },
  {
    "id": "CZ-66",
    "neighbours": [
      "CZ-69",
      "CZ-68",
      "CZ-67",
      "CZ-60-64",
      "CZ-59",
      "AT-37",
      "AT-20"
    ]
  },
  {
    "id": "CZ-60-64",
    "neighbours": [
      "CZ-66"
    ]
  },
  {
    "id": "CZ-59",
    "neighbours": [
      "CZ-67",
      "CZ-66",
      "CZ-58",
      "CZ-57",
      "CZ-56",
      "CZ-53"
    ]
  },
  {
    "id": "CZ-58",
    "neighbours": [
      "CZ-67",
      "CZ-59",
      "CZ-53",
      "CZ-39",
      "CZ-38",
      "CZ-37",
      "CZ-28"
    ]
  },
  {
    "id": "CZ-57",
    "neighbours": [
      "CZ-59",
      "CZ-56",
      "CZ-53"
    ]
  },
  {
    "id": "CZ-56",
    "neighbours": [
      "CZ-79",
      "CZ-78",
      "CZ-68",
      "CZ-67",
      "CZ-59",
      "CZ-57",
      "CZ-53",
      "CZ-51",
      "PL-57"
    ]
  },
  {
    "id": "CZ-55",
    "neighbours": [
      "CZ-54",
      "CZ-50",
      "PL-58",
      "PL-57"
    ]
  },
  {
    "id": "CZ-54",
    "neighbours": [
      "CZ-55",
      "CZ-51",
      "CZ-50",
      "CZ-46",
      "PL-58",
      "PL-57"
    ]
  },
  {
    "id": "CZ-53",
    "neighbours": [
      "CZ-59",
      "CZ-58",
      "CZ-57",
      "CZ-56",
      "CZ-51",
      "CZ-50",
      "CZ-28"
    ]
  },
  {
    "id": "CZ-51",
    "neighbours": [
      "CZ-56",
      "CZ-54",
      "CZ-53",
      "CZ-47",
      "CZ-46",
      "CZ-29",
      "PL-58",
      "PL-57"
    ]
  },
  {
    "id": "CZ-50",
    "neighbours": [
      "CZ-55",
      "CZ-54",
      "CZ-53",
      "CZ-51",
      "CZ-46",
      "CZ-29",
      "CZ-28"
    ]
  },
  {
    "id": "CZ-47",
    "neighbours": [
      "CZ-46",
      "CZ-41",
      "CZ-40",
      "CZ-29",
      "CZ-27",
      "DE-02"
    ]
  },
  {
    "id": "CZ-46",
    "neighbours": [
      "CZ-51",
      "CZ-47",
      "CZ-29",
      "PL-59",
      "PL-58",
      "DE-02"
    ]
  },
  {
    "id": "CZ-44",
    "neighbours": [
      "CZ-43",
      "CZ-41",
      "CZ-36"
    ]
  },
  {
    "id": "CZ-43",
    "neighbours": [
      "CZ-44",
      "CZ-41",
      "CZ-36",
      "CZ-33",
      "CZ-27",
      "DE-09",
      "DE-08",
      "DE-01"
    ]
  },
  {
    "id": "CZ-41",
    "neighbours": [
      "CZ-47",
      "CZ-44",
      "CZ-43",
      "CZ-40",
      "CZ-27",
      "DE-09",
      "DE-01"
    ]
  },
  {
    "id": "CZ-40",
    "neighbours": [
      "CZ-47",
      "CZ-41",
      "DE-02",
      "DE-01"
    ]
  },
  {
    "id": "CZ-39",
    "neighbours": [
      "CZ-58",
      "CZ-38",
      "CZ-37",
      "CZ-34",
      "CZ-33",
      "CZ-26",
      "CZ-25"
    ]
  },
  {
    "id": "CZ-38",
    "neighbours": [
      "CZ-34",
      "CZ-33",
      "CZ-26",
      "AT-42",
      "AT-41",
      "AT-39",
      "AT-38",
      "AT-20",
      "DE-94"
    ]
  },
  {
    "id": "CZ-37",
    "neighbours": [
      "CZ-67",
      "CZ-58",
      "CZ-39",
      "CZ-38",
      "AT-42",
      "AT-39",
      "AT-38"
    ]
  },
  {
    "id": "CZ-36",
    "neighbours": [
      "CZ-44",
      "CZ-43",
      "CZ-35",
      "CZ-33",
      "DE-09",
      "DE-08"
    ]
  },
  {
    "id": "CZ-35",
    "neighbours": [
      "CZ-36",
      "CZ-34",
      "DE-95",
      "DE-08"
    ]
  },
  {
    "id": "CZ-34",
    "neighbours": [
      "CZ-38",
      "CZ-36",
      "CZ-35",
      "CZ-33",
      "DE-95",
      "DE-94",
      "DE-93",
      "DE-92"
    ]
  },
  {
    "id": "CZ-33",
    "neighbours": [
      "CZ-44",
      "CZ-43",
      "CZ-38",
      "CZ-36",
      "CZ-34",
      "CZ-30-32",
      "CZ-27",
      "CZ-26",
      "DE-94"
    ]
  },
  {
    "id": "CZ-30-32",
    "neighbours": [
      "CZ-33"
    ]
  },
  {
    "id": "CZ-29",
    "neighbours": [
      "CZ-51",
      "CZ-50",
      "CZ-47",
      "CZ-46",
      "CZ-27",
      "CZ-28"
    ]
  },
  {
    "id": "CZ-27",
    "neighbours": [
      "CZ-47",
      "CZ-44",
      "CZ-43",
      "CZ-41",
      "CZ-36",
      "CZ-33",
      "CZ-29",
      "CZ-26",
      "CZ-25",
      "CZ-10-18"
    ]
  },
  {
    "id": "CZ-28",
    "neighbours": [
      "CZ-58",
      "CZ-53",
      "CZ-50",
      "CZ-29",
      "CZ-25",
      "CZ-10-18"
    ]
  },
  {
    "id": "CZ-26",
    "neighbours": [
      "CZ-43",
      "CZ-39",
      "CZ-38",
      "CZ-33",
      "CZ-27",
      "CZ-25",
      "CZ-10-18"
    ]
  },
  {
    "id": "CZ-25",
    "neighbours": [
      "CZ-58",
      "CZ-41",
      "CZ-39",
      "CZ-29",
      "CZ-27",
      "CZ-28",
      "CZ-26",
      "CZ-10-18"
    ]
  },
  {
    "id": "CZ-10-18",
    "neighbours": [
      "CZ-27",
      "CZ-25"
    ]
  },
  {
    "id": "ES-50",
    "neighbours": [
      "ES-44",
      "ES-43",
      "ES-42",
      "ES-31",
      "ES-26",
      "ES-25",
      "ES-22",
      "ES-19",
      "FR-64"
    ]
  },
  {
    "id": "ES-49",
    "neighbours": [
      "ES-47",
      "ES-37",
      "ES-32",
      "ES-27",
      "ES-24",
      "ES-05",
      "PT-05"
    ]
  },
  {
    "id": "ES-48",
    "neighbours": [
      "ES-39",
      "ES-20",
      "ES-09",
      "ES-01"
    ]
  },
  {
    "id": "ES-47",
    "neighbours": [
      "ES-49",
      "ES-40",
      "ES-37",
      "ES-34",
      "ES-24",
      "ES-05"
    ]
  },
  {
    "id": "ES-46",
    "neighbours": [
      "ES-44",
      "ES-12",
      "ES-16",
      "ES-03",
      "ES-02"
    ]
  },
  {
    "id": "ES-45",
    "neighbours": [
      "ES-28",
      "ES-13",
      "ES-16",
      "ES-10",
      "ES-06",
      "ES-05"
    ]
  },
  {
    "id": "ES-44",
    "neighbours": [
      "ES-50",
      "ES-46",
      "ES-43",
      "ES-22",
      "ES-12",
      "ES-16",
      "ES-19"
    ]
  },
  {
    "id": "ES-43",
    "neighbours": [
      "ES-50",
      "ES-44",
      "ES-25",
      "ES-12",
      "ES-08"
    ]
  },
  {
    "id": "ES-42",
    "neighbours": [
      "ES-50",
      "ES-40",
      "ES-31",
      "ES-26",
      "ES-19",
      "ES-09"
    ]
  },
  {
    "id": "ES-41",
    "neighbours": [
      "ES-29",
      "ES-21",
      "ES-11",
      "ES-14",
      "ES-06"
    ]
  },
  {
    "id": "ES-40",
    "neighbours": [
      "ES-47",
      "ES-42",
      "ES-28",
      "ES-19",
      "ES-09",
      "ES-05"
    ]
  },
  {
    "id": "ES-39",
    "neighbours": [
      "ES-48",
      "ES-34",
      "ES-33",
      "ES-24",
      "ES-09"
    ]
  },
  {
    "id": "ES-37",
    "neighbours": [
      "ES-49",
      "ES-47",
      "ES-10",
      "ES-05",
      "PT-06",
      "PT-05"
    ]
  },
  {
    "id": "ES-36",
    "neighbours": [
      "ES-32",
      "ES-15",
      "PT-04"
    ]
  },
  {
    "id": "ES-34",
    "neighbours": [
      "ES-47",
      "ES-39",
      "ES-33",
      "ES-24",
      "ES-09"
    ]
  },
  {
    "id": "ES-33",
    "neighbours": [
      "ES-39",
      "ES-27",
      "ES-24"
    ]
  },
  {
    "id": "ES-32",
    "neighbours": [
      "ES-49",
      "ES-36",
      "ES-27",
      "ES-24",
      "PT-05",
      "PT-04"
    ]
  },
  {
    "id": "ES-31",
    "neighbours": [
      "ES-50",
      "ES-42",
      "ES-26",
      "ES-22",
      "ES-20",
      "ES-09",
      "ES-01",
      "FR-64"
    ]
  },
  {
    "id": "ES-30",
    "neighbours": [
      "ES-46",
      "ES-23",
      "ES-18",
      "ES-04",
      "ES-03",
      "ES-02"
    ]
  },
  {
    "id": "ES-29",
    "neighbours": [
      "ES-41",
      "ES-11",
      "ES-14",
      "ES-18"
    ]
  },
  {
    "id": "ES-28",
    "neighbours": [
      "ES-45",
      "ES-40",
      "ES-16",
      "ES-19",
      "ES-05"
    ]
  },
  {
    "id": "ES-27",
    "neighbours": [
      "ES-36",
      "ES-33",
      "ES-32",
      "ES-24",
      "ES-15"
    ]
  },
  {
    "id": "ES-26",
    "neighbours": [
      "ES-50",
      "ES-42",
      "ES-31",
      "ES-09",
      "ES-01"
    ]
  },
  {
    "id": "ES-25",
    "neighbours": [
      "ES-50",
      "ES-43",
      "ES-22",
      "ES-17",
      "ES-08",
      "FR-66",
      "FR-65",
      "FR-31",
      "FR-09"
    ]
  },
  {
    "id": "ES-24",
    "neighbours": [
      "ES-49",
      "ES-47",
      "ES-34",
      "ES-33",
      "ES-32",
      "ES-27"
    ]
  },
  {
    "id": "ES-23",
    "neighbours": [
      "ES-30",
      "ES-13",
      "ES-14",
      "ES-18",
      "ES-02"
    ]
  },
  {
    "id": "ES-22",
    "neighbours": [
      "ES-50",
      "ES-44",
      "ES-43",
      "ES-31",
      "ES-25",
      "FR-65",
      "FR-64",
      "FR-31",
      "FR-09"
    ]
  },
  {
    "id": "ES-21",
    "neighbours": [
      "ES-41",
      "ES-11",
      "ES-06",
      "PT-08",
      "PT-07"
    ]
  },
  {
    "id": "ES-20",
    "neighbours": [
      "ES-48",
      "ES-31",
      "ES-01",
      "FR-64"
    ]
  },
  {
    "id": "ES-11",
    "neighbours": [
      "ES-41",
      "ES-29",
      "ES-21"
    ]
  },
  {
    "id": "ES-12",
    "neighbours": [
      "ES-46",
      "ES-44",
      "ES-43"
    ]
  },
  {
    "id": "ES-13",
    "neighbours": [
      "ES-45",
      "ES-23",
      "ES-14",
      "ES-16",
      "ES-10",
      "ES-06",
      "ES-02"
    ]
  },
  {
    "id": "ES-14",
    "neighbours": [
      "ES-41",
      "ES-29",
      "ES-23",
      "ES-13",
      "ES-18",
      "ES-06"
    ]
  },
  {
    "id": "ES-15",
    "neighbours": [
      "ES-36",
      "ES-27"
    ]
  },
  {
    "id": "ES-16",
    "neighbours": [
      "ES-46",
      "ES-45",
      "ES-44",
      "ES-28",
      "ES-12",
      "ES-13",
      "ES-19",
      "ES-02"
    ]
  },
  {
    "id": "ES-17",
    "neighbours": [
      "ES-25",
      "ES-08",
      "FR-66"
    ]
  },
  {
    "id": "ES-18",
    "neighbours": [
      "ES-30",
      "ES-29",
      "ES-23",
      "ES-14",
      "ES-04",
      "ES-02"
    ]
  },
  {
    "id": "ES-19",
    "neighbours": [
      "ES-50",
      "ES-44",
      "ES-42",
      "ES-40",
      "ES-28",
      "ES-16"
    ]
  },
  {
    "id": "ES-10",
    "neighbours": [
      "ES-45",
      "ES-37",
      "ES-13",
      "ES-06",
      "ES-05",
      "PT-07",
      "PT-06"
    ]
  },
  {
    "id": "ES-09",
    "neighbours": [
      "ES-48",
      "ES-47",
      "ES-42",
      "ES-40",
      "ES-39",
      "ES-34",
      "ES-26",
      "ES-01"
    ]
  },
  {
    "id": "ES-08",
    "neighbours": [
      "ES-43",
      "ES-25",
      "ES-17",
      "FR-66"
    ]
  },
  {
    "id": "ES-07",
    "neighbours": []
  },
  {
    "id": "ES-06",
    "neighbours": [
      "ES-45",
      "ES-41",
      "ES-21",
      "ES-13",
      "ES-14",
      "ES-10",
      "PT-07"
    ]
  },
  {
    "id": "ES-05",
    "neighbours": [
      "ES-47",
      "ES-45",
      "ES-40",
      "ES-37",
      "ES-28",
      "ES-10"
    ]
  },
  {
    "id": "ES-04",
    "neighbours": [
      "ES-30",
      "ES-18"
    ]
  },
  {
    "id": "ES-03",
    "neighbours": [
      "ES-46",
      "ES-30",
      "ES-02"
    ]
  },
  {
    "id": "ES-02",
    "neighbours": [
      "ES-46",
      "ES-30",
      "ES-23",
      "ES-13",
      "ES-16",
      "ES-18",
      "ES-03"
    ]
  },
  {
    "id": "ES-01",
    "neighbours": [
      "ES-48",
      "ES-31",
      "ES-26",
      "ES-20",
      "ES-09"
    ]
  },
  {
    "id": "SK-99",
    "neighbours": [
      "SK-98",
      "SK-96",
      "SK-93",
      "HU-02"
    ]
  },
  {
    "id": "SK-98",
    "neighbours": [
      "SK-99",
      "SK-97",
      "SK-96",
      "SK-05",
      "SK-04",
      "HU-03"
    ]
  },
  {
    "id": "SK-97",
    "neighbours": [
      "SK-98",
      "SK-96",
      "SK-95",
      "SK-05",
      "SK-91",
      "SK-04",
      "SK-03",
      "SK-01",
      "HU-03"
    ]
  },
  {
    "id": "SK-96",
    "neighbours": [
      "SK-99",
      "SK-98",
      "SK-97",
      "SK-95",
      "SK-93",
      "SK-03"
    ]
  },
  {
    "id": "SK-95",
    "neighbours": [
      "SK-97",
      "SK-96",
      "SK-94",
      "SK-93",
      "SK-92",
      "SK-91",
      "SK-01"
    ]
  },
  {
    "id": "SK-05",
    "neighbours": [
      "SK-98",
      "SK-97",
      "SK-08",
      "SK-06",
      "SK-04",
      "SK-03",
      "SK-02",
      "PL-34"
    ]
  },
  {
    "id": "SK-94",
    "neighbours": [
      "SK-95",
      "SK-93",
      "SK-92",
      "HU-09",
      "HU-02"
    ]
  },
  {
    "id": "SK-93",
    "neighbours": [
      "SK-99",
      "SK-96",
      "SK-95",
      "SK-92",
      "SK-90",
      "SK-81-85",
      "AT-71",
      "AT-24",
      "HU-09",
      "HU-02"
    ]
  },
  {
    "id": "SK-92",
    "neighbours": [
      "SK-95",
      "SK-94",
      "SK-93",
      "SK-91",
      "SK-90"
    ]
  },
  {
    "id": "SK-91",
    "neighbours": [
      "CZ-76",
      "CZ-69",
      "CZ-68",
      "SK-97",
      "SK-95",
      "SK-93",
      "SK-92",
      "SK-90",
      "SK-02",
      "SK-01"
    ]
  },
  {
    "id": "SK-90",
    "neighbours": [
      "CZ-69",
      "CZ-68",
      "SK-93",
      "SK-92",
      "SK-91",
      "SK-81-85",
      "AT-22",
      "AT-21"
    ]
  },
  {
    "id": "SK-81-85",
    "neighbours": [
      "SK-93",
      "SK-90",
      "AT-24",
      "AT-22"
    ]
  },
  {
    "id": "SK-09",
    "neighbours": [
      "SK-08",
      "SK-07",
      "SK-06",
      "SK-04",
      "PL-38"
    ]
  },
  {
    "id": "SK-08",
    "neighbours": [
      "SK-05",
      "SK-09",
      "SK-06",
      "SK-04",
      "PL-38",
      "PL-33"
    ]
  },
  {
    "id": "SK-07",
    "neighbours": [
      "SK-09",
      "SK-06",
      "SK-04",
      "UA-88",
      "HU-04",
      "HU-03"
    ]
  },
  {
    "id": "SK-06",
    "neighbours": [
      "SK-05",
      "SK-09",
      "SK-08",
      "SK-07",
      "PL-38",
      "PL-34",
      "PL-33",
      "UA-79"
    ]
  },
  {
    "id": "SK-04",
    "neighbours": [
      "SK-98",
      "SK-97",
      "SK-05",
      "SK-09",
      "SK-08",
      "SK-07",
      "HU-03"
    ]
  },
  {
    "id": "SK-03",
    "neighbours": [
      "SK-97",
      "SK-96",
      "SK-05",
      "SK-06",
      "SK-04",
      "SK-02",
      "SK-01",
      "PL-34"
    ]
  },
  {
    "id": "SK-02",
    "neighbours": [
      "CZ-76",
      "CZ-75",
      "CZ-73",
      "SK-05",
      "SK-91",
      "SK-03",
      "SK-01",
      "PL-43",
      "PL-34"
    ]
  },
  {
    "id": "SK-01",
    "neighbours": [
      "CZ-76",
      "CZ-75",
      "CZ-73",
      "SK-97",
      "SK-95",
      "SK-91",
      "SK-03",
      "SK-02"
    ]
  },
  {
    "id": "SI-09",
    "neighbours": [
      "SI-02",
      "AT-84",
      "AT-83",
      "HU-09",
      "HU-08"
    ]
  },
  {
    "id": "SI-08",
    "neighbours": [
      "SI-03",
      "SI-01",
      "HR-05",
      "HR-04",
      "HR-01"
    ]
  },
  {
    "id": "SI-06",
    "neighbours": [
      "SI-05",
      "SI-01",
      "HR-05",
      "IT-34"
    ]
  },
  {
    "id": "SI-05",
    "neighbours": [
      "SI-06",
      "SI-04",
      "SI-01",
      "AT-96",
      "AT-95",
      "IT-34",
      "IT-33"
    ]
  },
  {
    "id": "SI-04",
    "neighbours": [
      "SI-05",
      "SI-03",
      "SI-01",
      "AT-96",
      "AT-95",
      "AT-92",
      "AT-91",
      "IT-33"
    ]
  },
  {
    "id": "SI-03",
    "neighbours": [
      "SI-08",
      "SI-04",
      "SI-02",
      "SI-01",
      "AT-91",
      "HR-04",
      "HR-01"
    ]
  },
  {
    "id": "SI-02",
    "neighbours": [
      "SI-09",
      "SI-03",
      "AT-94",
      "AT-91",
      "AT-85",
      "AT-84",
      "AT-83",
      "AT-80",
      "HR-04"
    ]
  },
  {
    "id": "SI-01",
    "neighbours": [
      "SI-08",
      "SI-06",
      "SI-05",
      "SI-04",
      "SI-03",
      "AT-91",
      "HR-05"
    ]
  },
  {
    "id": "RS-38",
    "neighbours": [
      "RS-37",
      "RS-36",
      "RS-18",
      "RS-17",
      "RS-16",
      "ME-84",
      "MK-13",
      "MK-12",
      "MK-10",
      "AL-08",
      "AL-04"
    ]
  },
  {
    "id": "RS-37",
    "neighbours": [
      "RS-38",
      "RS-36",
      "RS-35",
      "RS-19",
      "RS-18"
    ]
  },
  {
    "id": "RS-36",
    "neighbours": [
      "RS-38",
      "RS-37",
      "RS-35",
      "RS-34",
      "RS-32",
      "RS-31",
      "ME-84"
    ]
  },
  {
    "id": "RS-35",
    "neighbours": [
      "RS-37",
      "RS-36",
      "RS-34",
      "RS-19",
      "RS-12",
      "RS-11"
    ]
  },
  {
    "id": "RS-34",
    "neighbours": [
      "RS-37",
      "RS-36",
      "RS-35",
      "RS-32",
      "RS-14",
      "RS-11"
    ]
  },
  {
    "id": "RS-32",
    "neighbours": [
      "RS-36",
      "RS-34",
      "RS-31",
      "RS-14",
      "RS-11"
    ]
  },
  {
    "id": "RS-31",
    "neighbours": [
      "RS-36",
      "RS-32",
      "RS-15",
      "RS-14",
      "ME-84",
      "BA-75",
      "BA-73"
    ]
  },
  {
    "id": "RS-26",
    "neighbours": [
      "RS-23",
      "RS-22",
      "RS-21",
      "RS-12",
      "RS-11",
      "RO-32",
      "RO-30"
    ]
  },
  {
    "id": "RS-25",
    "neighbours": [
      "RS-24",
      "RS-21",
      "HR-03",
      "HU-07",
      "HU-06"
    ]
  },
  {
    "id": "RS-24",
    "neighbours": [
      "RS-25",
      "RS-23",
      "RS-21",
      "HU-06"
    ]
  },
  {
    "id": "RS-23",
    "neighbours": [
      "RS-26",
      "RS-24",
      "RS-22",
      "RS-21",
      "RS-11",
      "RO-30",
      "HU-06"
    ]
  },
  {
    "id": "RS-22",
    "neighbours": [
      "RS-26",
      "RS-23",
      "RS-21",
      "RS-15",
      "RS-14",
      "RS-11",
      "HR-03",
      "BA-76"
    ]
  },
  {
    "id": "RS-21",
    "neighbours": [
      "RS-26",
      "RS-25",
      "RS-24",
      "RS-23",
      "RS-22",
      "HR-03"
    ]
  },
  {
    "id": "RS-19",
    "neighbours": [
      "RS-37",
      "RS-35",
      "RS-18",
      "RS-12",
      "RO-32",
      "RO-22",
      "BG-03"
    ]
  },
  {
    "id": "RS-18",
    "neighbours": [
      "RS-38",
      "RS-37",
      "RS-36",
      "RS-35",
      "RS-19",
      "RS-16",
      "BG-03",
      "BG-02"
    ]
  },
  {
    "id": "RS-17",
    "neighbours": [
      "RS-38",
      "RS-18",
      "RS-16",
      "MK-13",
      "MK-10",
      "BG-02"
    ]
  },
  {
    "id": "RS-16",
    "neighbours": [
      "RS-38",
      "RS-18",
      "RS-17",
      "BG-02"
    ]
  },
  {
    "id": "RS-15",
    "neighbours": [
      "RS-31",
      "RS-22",
      "RS-14",
      "RS-11",
      "BA-76",
      "BA-75"
    ]
  },
  {
    "id": "RS-14",
    "neighbours": [
      "RS-34",
      "RS-32",
      "RS-31",
      "RS-15",
      "RS-11",
      "BA-75"
    ]
  },
  {
    "id": "RS-12",
    "neighbours": [
      "RS-35",
      "RS-26",
      "RS-19",
      "RS-11",
      "RO-32",
      "RO-22"
    ]
  },
  {
    "id": "RS-11",
    "neighbours": [
      "RS-35",
      "RS-34",
      "RS-26",
      "RS-23",
      "RS-22",
      "RS-21",
      "RS-15",
      "RS-14",
      "RS-12"
    ]
  },
  {
    "id": "RO-92",
    "neighbours": [
      "RO-91",
      "RO-90",
      "RO-81",
      "RO-12",
      "RO-10",
      "RO-07"
    ]
  },
  {
    "id": "RO-91",
    "neighbours": [
      "RO-92",
      "RO-90",
      "RO-08",
      "RO-07",
      "BG-07"
    ]
  },
  {
    "id": "RO-90",
    "neighbours": [
      "RO-92",
      "RO-91",
      "RO-82",
      "RO-81",
      "BG-09",
      "BG-07"
    ]
  },
  {
    "id": "RO-82",
    "neighbours": [
      "RO-92",
      "RO-90",
      "RO-81",
      "RO-80",
      "UA-68"
    ]
  },
  {
    "id": "RO-81",
    "neighbours": [
      "RO-92",
      "RO-90",
      "RO-82",
      "RO-80",
      "RO-62",
      "RO-12"
    ]
  },
  {
    "id": "RO-80",
    "neighbours": [
      "RO-82",
      "RO-81",
      "RO-73",
      "RO-62",
      "RO-60",
      "MD-73",
      "MD-53",
      "MD-39"
    ]
  },
  {
    "id": "RO-73",
    "neighbours": [
      "RO-80",
      "RO-70",
      "RO-62",
      "RO-61",
      "RO-60",
      "MD-73",
      "MD-64",
      "MD-63",
      "MD-39",
      "MD-34"
    ]
  },
  {
    "id": "RO-72",
    "neighbours": [
      "RO-71",
      "RO-70",
      "RO-61",
      "RO-54",
      "RO-53",
      "RO-43",
      "RO-42",
      "UA-76",
      "UA-58"
    ]
  },
  {
    "id": "RO-71",
    "neighbours": [
      "RO-72",
      "RO-70",
      "UA-58",
      "MD-59",
      "MD-56",
      "MD-49",
      "MD-47",
      "MD-46"
    ]
  },
  {
    "id": "RO-70",
    "neighbours": [
      "RO-73",
      "RO-72",
      "RO-71",
      "RO-61",
      "MD-64",
      "MD-59",
      "MD-49",
      "MD-36",
      "MD-34"
    ]
  },
  {
    "id": "RO-62",
    "neighbours": [
      "RO-81",
      "RO-80",
      "RO-73",
      "RO-60",
      "RO-52",
      "RO-12"
    ]
  },
  {
    "id": "RO-61",
    "neighbours": [
      "RO-73",
      "RO-72",
      "RO-70",
      "RO-60",
      "RO-53"
    ]
  },
  {
    "id": "RO-60",
    "neighbours": [
      "RO-80",
      "RO-73",
      "RO-70",
      "RO-62",
      "RO-61",
      "RO-53",
      "RO-52"
    ]
  },
  {
    "id": "RO-55",
    "neighbours": [
      "RO-54",
      "RO-51",
      "RO-50",
      "RO-33",
      "RO-24",
      "RO-11"
    ]
  },
  {
    "id": "RO-54",
    "neighbours": [
      "RO-72",
      "RO-55",
      "RO-53",
      "RO-51",
      "RO-50",
      "RO-42",
      "RO-40"
    ]
  },
  {
    "id": "RO-53",
    "neighbours": [
      "RO-72",
      "RO-61",
      "RO-60",
      "RO-55",
      "RO-54",
      "RO-52",
      "RO-50"
    ]
  },
  {
    "id": "RO-52",
    "neighbours": [
      "RO-62",
      "RO-60",
      "RO-53",
      "RO-50",
      "RO-12"
    ]
  },
  {
    "id": "RO-51",
    "neighbours": [
      "RO-55",
      "RO-54",
      "RO-41",
      "RO-40",
      "RO-33",
      "RO-24",
      "RO-21"
    ]
  },
  {
    "id": "RO-50",
    "neighbours": [
      "RO-55",
      "RO-54",
      "RO-53",
      "RO-52",
      "RO-13",
      "RO-12",
      "RO-11",
      "RO-10"
    ]
  },
  {
    "id": "RO-45",
    "neighbours": [
      "RO-44",
      "RO-43",
      "RO-41",
      "RO-40"
    ]
  },
  {
    "id": "RO-44",
    "neighbours": [
      "RO-45",
      "RO-43",
      "RO-41",
      "UA-88",
      "HU-04"
    ]
  },
  {
    "id": "RO-43",
    "neighbours": [
      "RO-72",
      "RO-45",
      "RO-44",
      "RO-42",
      "RO-40",
      "UA-88",
      "UA-76",
      "UA-58"
    ]
  },
  {
    "id": "RO-42",
    "neighbours": [
      "RO-72",
      "RO-54",
      "RO-53",
      "RO-45",
      "RO-43",
      "RO-40",
      "UA-58"
    ]
  },
  {
    "id": "RO-41",
    "neighbours": [
      "RO-51",
      "RO-45",
      "RO-44",
      "RO-40",
      "RO-33",
      "RO-31",
      "HU-05",
      "HU-04"
    ]
  },
  {
    "id": "RO-40",
    "neighbours": [
      "RO-54",
      "RO-51",
      "RO-45",
      "RO-43",
      "RO-42",
      "RO-41"
    ]
  },
  {
    "id": "RO-33",
    "neighbours": [
      "RO-55",
      "RO-51",
      "RO-41",
      "RO-32",
      "RO-31",
      "RO-30",
      "RO-24",
      "RO-22",
      "RO-21"
    ]
  },
  {
    "id": "RO-32",
    "neighbours": [
      "RS-26",
      "RS-19",
      "RS-12",
      "RO-33",
      "RO-30",
      "RO-22",
      "RO-21"
    ]
  },
  {
    "id": "RO-31",
    "neighbours": [
      "RO-51",
      "RO-41",
      "RO-33",
      "RO-30",
      "HU-06",
      "HU-05"
    ]
  },
  {
    "id": "RO-30",
    "neighbours": [
      "RS-26",
      "RS-24",
      "RS-23",
      "RO-33",
      "RO-32",
      "RO-31",
      "HU-06"
    ]
  },
  {
    "id": "RO-24",
    "neighbours": [
      "RO-55",
      "RO-51",
      "RO-33",
      "RO-23",
      "RO-21",
      "RO-20",
      "RO-11"
    ]
  },
  {
    "id": "RO-23",
    "neighbours": [
      "RO-24",
      "RO-20",
      "RO-14",
      "RO-11",
      "BG-05",
      "BG-03"
    ]
  },
  {
    "id": "RO-22",
    "neighbours": [
      "RS-19",
      "RS-12",
      "RO-33",
      "RO-32",
      "RO-21",
      "RO-20",
      "BG-03"
    ]
  },
  {
    "id": "RO-21",
    "neighbours": [
      "RO-55",
      "RO-33",
      "RO-32",
      "RO-24",
      "RO-22",
      "RO-20"
    ]
  },
  {
    "id": "RO-20",
    "neighbours": [
      "RO-24",
      "RO-23",
      "RO-22",
      "RO-21",
      "BG-05",
      "BG-03"
    ]
  },
  {
    "id": "RO-14",
    "neighbours": [
      "RO-23",
      "RO-13",
      "RO-11",
      "RO-08",
      "BG-07",
      "BG-05"
    ]
  },
  {
    "id": "RO-13",
    "neighbours": [
      "RO-50",
      "RO-14",
      "RO-11",
      "RO-10",
      "RO-08",
      "RO-07"
    ]
  },
  {
    "id": "RO-12",
    "neighbours": [
      "RO-92",
      "RO-81",
      "RO-62",
      "RO-52",
      "RO-50",
      "RO-10"
    ]
  },
  {
    "id": "RO-11",
    "neighbours": [
      "RO-55",
      "RO-50",
      "RO-24",
      "RO-23",
      "RO-14",
      "RO-13"
    ]
  },
  {
    "id": "RO-10",
    "neighbours": [
      "RO-92",
      "RO-52",
      "RO-50",
      "RO-13",
      "RO-12",
      "RO-07"
    ]
  },
  {
    "id": "RO-08",
    "neighbours": [
      "RO-91",
      "RO-14",
      "RO-13",
      "RO-07",
      "BG-07"
    ]
  },
  {
    "id": "RO-07",
    "neighbours": [
      "RO-92",
      "RO-91",
      "RO-13",
      "RO-10",
      "RO-08"
    ]
  },
  {
    "id": "PT-08",
    "neighbours": [
      "ES-21",
      "PT-07"
    ]
  },
  {
    "id": "PT-07",
    "neighbours": [
      "ES-21",
      "ES-10",
      "ES-06",
      "PT-08",
      "PT-06",
      "PT-02"
    ]
  },
  {
    "id": "PT-06",
    "neighbours": [
      "ES-37",
      "ES-10",
      "PT-07",
      "PT-05",
      "PT-03",
      "PT-02"
    ]
  },
  {
    "id": "PT-05",
    "neighbours": [
      "ES-49",
      "ES-37",
      "ES-32",
      "PT-06",
      "PT-04",
      "PT-03"
    ]
  },
  {
    "id": "PT-04",
    "neighbours": [
      "ES-36",
      "ES-32",
      "PT-05",
      "PT-03"
    ]
  },
  {
    "id": "PT-03",
    "neighbours": [
      "PT-06",
      "PT-05",
      "PT-04",
      "PT-02"
    ]
  },
  {
    "id": "PT-02",
    "neighbours": [
      "PT-07",
      "PT-06",
      "PT-03",
      "PT-01"
    ]
  },
  {
    "id": "PT-01",
    "neighbours": [
      "PT-02"
    ]
  },
  {
    "id": "PL-99",
    "neighbours": [
      "PL-98",
      "PL-95",
      "PL-90-94",
      "PL-87",
      "PL-62",
      "PL-09",
      "PL-05"
    ]
  },
  {
    "id": "PL-98",
    "neighbours": [
      "PL-99",
      "PL-97",
      "PL-90-94",
      "PL-50-51",
      "PL-63",
      "PL-62",
      "PL-46",
      "PL-42"
    ]
  },
  {
    "id": "PL-97",
    "neighbours": [
      "PL-98",
      "PL-95",
      "PL-90-94",
      "PL-50-51",
      "PL-42",
      "PL-29",
      "PL-26"
    ]
  },
  {
    "id": "PL-95",
    "neighbours": [
      "PL-99",
      "PL-97",
      "PL-90-94",
      "PL-26",
      "PL-09",
      "PL-05"
    ]
  },
  {
    "id": "PL-90-94",
    "neighbours": [
      "PL-99",
      "PL-98",
      "PL-97",
      "PL-95",
      "PL-50-51"
    ]
  },
  {
    "id": "PL-50-51",
    "neighbours": [
      "PL-90-94"
    ]
  },
  {
    "id": "PL-89",
    "neighbours": [
      "PL-88",
      "PL-86",
      "PL-83",
      "PL-77",
      "PL-64",
      "PL-62"
    ]
  },
  {
    "id": "PL-88",
    "neighbours": [
      "PL-89",
      "PL-87",
      "PL-86",
      "PL-62"
    ]
  },
  {
    "id": "PL-87",
    "neighbours": [
      "PL-99",
      "PL-88",
      "PL-86",
      "PL-85",
      "PL-82",
      "PL-62",
      "PL-14",
      "PL-13",
      "PL-09"
    ]
  },
  {
    "id": "PL-86",
    "neighbours": [
      "PL-89",
      "PL-88",
      "PL-87",
      "PL-85",
      "PL-83",
      "PL-82",
      "PL-14",
      "PL-13"
    ]
  },
  {
    "id": "PL-85",
    "neighbours": [
      "PL-87",
      "PL-86"
    ]
  },
  {
    "id": "PL-84",
    "neighbours": [
      "PL-83",
      "PL-81",
      "PL-80",
      "PL-77",
      "PL-76"
    ]
  },
  {
    "id": "PL-83",
    "neighbours": [
      "PL-89",
      "PL-86",
      "PL-84",
      "PL-82",
      "PL-81",
      "PL-80",
      "PL-77",
      "PL-76"
    ]
  },
  {
    "id": "PL-82",
    "neighbours": [
      "PL-86",
      "PL-83",
      "PL-80",
      "PL-14"
    ]
  },
  {
    "id": "PL-81",
    "neighbours": [
      "PL-84",
      "PL-80"
    ]
  },
  {
    "id": "PL-80",
    "neighbours": [
      "PL-84",
      "PL-83",
      "PL-82",
      "PL-81"
    ]
  },
  {
    "id": "PL-78",
    "neighbours": [
      "PL-77",
      "PL-76",
      "PL-75",
      "PL-73",
      "PL-72",
      "PL-66",
      "PL-64"
    ]
  },
  {
    "id": "PL-77",
    "neighbours": [
      "PL-89",
      "PL-84",
      "PL-83",
      "PL-78",
      "PL-76",
      "PL-64"
    ]
  },
  {
    "id": "PL-76",
    "neighbours": [
      "PL-84",
      "PL-78",
      "PL-77",
      "PL-75"
    ]
  },
  {
    "id": "PL-75",
    "neighbours": [
      "PL-76"
    ]
  },
  {
    "id": "PL-74",
    "neighbours": [
      "PL-73",
      "PL-72",
      "PL-70-71",
      "PL-69",
      "PL-66",
      "DE-16",
      "DE-15"
    ]
  },
  {
    "id": "PL-73",
    "neighbours": [
      "PL-78",
      "PL-74",
      "PL-72",
      "PL-70-71",
      "PL-66"
    ]
  },
  {
    "id": "PL-72",
    "neighbours": [
      "PL-78",
      "PL-74",
      "PL-73",
      "PL-70-71",
      "DE-17"
    ]
  },
  {
    "id": "PL-70-71",
    "neighbours": [
      "PL-74",
      "PL-72"
    ]
  },
  {
    "id": "PL-69",
    "neighbours": [
      "PL-66",
      "DE-15",
      "DE-03"
    ]
  },
  {
    "id": "PL-68",
    "neighbours": [
      "PL-67",
      "PL-66",
      "PL-59",
      "DE-03",
      "DE-02"
    ]
  },
  {
    "id": "PL-67",
    "neighbours": [
      "PL-68",
      "PL-66",
      "PL-65",
      "PL-64",
      "PL-59",
      "PL-56"
    ]
  },
  {
    "id": "PL-66",
    "neighbours": [
      "PL-78",
      "PL-74",
      "PL-73",
      "PL-69",
      "PL-68",
      "PL-67",
      "PL-65",
      "PL-64",
      "DE-15",
      "DE-03"
    ]
  },
  {
    "id": "PL-65",
    "neighbours": []
  },
  {
    "id": "PL-64",
    "neighbours": [
      "PL-89",
      "PL-78",
      "PL-77",
      "PL-67",
      "PL-66",
      "PL-63",
      "PL-62",
      "PL-59",
      "PL-56",
      "PL-55"
    ]
  },
  {
    "id": "PL-63",
    "neighbours": [
      "PL-98",
      "PL-64",
      "PL-62",
      "PL-60-61",
      "PL-56",
      "PL-55",
      "PL-46"
    ]
  },
  {
    "id": "PL-62",
    "neighbours": [
      "PL-99",
      "PL-98",
      "PL-90-94",
      "PL-89",
      "PL-88",
      "PL-87",
      "PL-77",
      "PL-64",
      "PL-63",
      "PL-60-61"
    ]
  },
  {
    "id": "PL-60-61",
    "neighbours": [
      "PL-62"
    ]
  },
  {
    "id": "PL-59",
    "neighbours": [
      "CZ-51",
      "CZ-47",
      "CZ-46",
      "CZ-40",
      "PL-68",
      "PL-67",
      "PL-64",
      "PL-63",
      "PL-58",
      "PL-56",
      "PL-55",
      "DE-02"
    ]
  },
  {
    "id": "PL-58",
    "neighbours": [
      "CZ-55",
      "CZ-54",
      "CZ-51",
      "CZ-46",
      "PL-59",
      "PL-57",
      "PL-55"
    ]
  },
  {
    "id": "PL-57",
    "neighbours": [
      "CZ-79",
      "CZ-78",
      "CZ-56",
      "CZ-55",
      "CZ-54",
      "CZ-51",
      "PL-58",
      "PL-55",
      "PL-50-54",
      "PL-49",
      "PL-48"
    ]
  },
  {
    "id": "PL-56",
    "neighbours": [
      "PL-67",
      "PL-64",
      "PL-63",
      "PL-59",
      "PL-55",
      "PL-50-54",
      "PL-49",
      "PL-46"
    ]
  },
  {
    "id": "PL-55",
    "neighbours": [
      "PL-63",
      "PL-59",
      "PL-58",
      "PL-57",
      "PL-56",
      "PL-50-54",
      "PL-49",
      "PL-46"
    ]
  },
  {
    "id": "PL-50-54",
    "neighbours": [
      "PL-55"
    ]
  },
  {
    "id": "PL-49",
    "neighbours": [
      "PL-57",
      "PL-55",
      "PL-48",
      "PL-47",
      "PL-46",
      "PL-45"
    ]
  },
  {
    "id": "PL-48",
    "neighbours": [
      "CZ-79",
      "CZ-74",
      "PL-57",
      "PL-49",
      "PL-47",
      "PL-46"
    ]
  },
  {
    "id": "PL-47",
    "neighbours": [
      "CZ-74",
      "CZ-73",
      "PL-49",
      "PL-48",
      "PL-46",
      "PL-45",
      "PL-44",
      "PL-42"
    ]
  },
  {
    "id": "PL-46",
    "neighbours": [
      "PL-98",
      "PL-63",
      "PL-56",
      "PL-55",
      "PL-49",
      "PL-48",
      "PL-47",
      "PL-45",
      "PL-42"
    ]
  },
  {
    "id": "PL-45",
    "neighbours": [
      "PL-49",
      "PL-46"
    ]
  },
  {
    "id": "PL-44",
    "neighbours": [
      "CZ-74",
      "CZ-73",
      "PL-47",
      "PL-43",
      "PL-42",
      "PL-41"
    ]
  },
  {
    "id": "PL-43",
    "neighbours": [
      "CZ-73",
      "SK-02",
      "PL-44",
      "PL-42",
      "PL-41",
      "PL-40",
      "PL-34",
      "PL-32"
    ]
  },
  {
    "id": "PL-42",
    "neighbours": [
      "PL-98",
      "PL-97",
      "PL-47",
      "PL-46",
      "PL-44",
      "PL-43",
      "PL-41",
      "PL-40",
      "PL-32",
      "PL-29",
      "PL-28"
    ]
  },
  {
    "id": "PL-41",
    "neighbours": [
      "PL-44",
      "PL-43",
      "PL-42",
      "PL-40"
    ]
  },
  {
    "id": "PL-40",
    "neighbours": [
      "PL-43",
      "PL-41"
    ]
  },
  {
    "id": "PL-39",
    "neighbours": [
      "PL-38",
      "PL-37",
      "PL-36",
      "PL-35",
      "PL-33",
      "PL-28",
      "PL-27",
      "PL-23"
    ]
  },
  {
    "id": "PL-38",
    "neighbours": [
      "SK-09",
      "SK-08",
      "SK-06",
      "PL-39",
      "PL-37",
      "PL-36",
      "PL-35",
      "PL-34",
      "PL-33",
      "PL-32",
      "UA-88",
      "UA-79"
    ]
  },
  {
    "id": "PL-37",
    "neighbours": [
      "PL-39",
      "PL-38",
      "PL-36",
      "PL-35",
      "PL-27",
      "PL-24",
      "PL-23",
      "PL-22",
      "UA-79"
    ]
  },
  {
    "id": "PL-36",
    "neighbours": [
      "PL-39",
      "PL-38",
      "PL-37",
      "PL-35",
      "PL-28",
      "PL-27"
    ]
  },
  {
    "id": "PL-35",
    "neighbours": []
  },
  {
    "id": "PL-34",
    "neighbours": [
      "CZ-73",
      "SK-05",
      "SK-06",
      "SK-03",
      "SK-02",
      "PL-43",
      "PL-33",
      "PL-32"
    ]
  },
  {
    "id": "PL-33",
    "neighbours": [
      "SK-05",
      "SK-08",
      "SK-06",
      "PL-39",
      "PL-38",
      "PL-34",
      "PL-32",
      "PL-28"
    ]
  },
  {
    "id": "PL-32",
    "neighbours": [
      "PL-43",
      "PL-42",
      "PL-41",
      "PL-40",
      "PL-38",
      "PL-34",
      "PL-33",
      "PL-30-31",
      "PL-29",
      "PL-28"
    ]
  },
  {
    "id": "PL-30-31",
    "neighbours": [
      "PL-32"
    ]
  },
  {
    "id": "PL-29",
    "neighbours": [
      "PL-97",
      "PL-42",
      "PL-28",
      "PL-26"
    ]
  },
  {
    "id": "PL-28",
    "neighbours": [
      "PL-42",
      "PL-39",
      "PL-36",
      "PL-33",
      "PL-32",
      "PL-29",
      "PL-27",
      "PL-26"
    ]
  },
  {
    "id": "PL-27",
    "neighbours": [
      "PL-39",
      "PL-37",
      "PL-36",
      "PL-28",
      "PL-26",
      "PL-24",
      "PL-23"
    ]
  },
  {
    "id": "PL-26",
    "neighbours": [
      "PL-97",
      "PL-95",
      "PL-29",
      "PL-28",
      "PL-27",
      "PL-25",
      "PL-24",
      "PL-08",
      "PL-05"
    ]
  },
  {
    "id": "PL-25",
    "neighbours": [
      "PL-26"
    ]
  },
  {
    "id": "PL-24",
    "neighbours": [
      "PL-27",
      "PL-26",
      "PL-23",
      "PL-21",
      "PL-20",
      "PL-08"
    ]
  },
  {
    "id": "PL-23",
    "neighbours": [
      "PL-37",
      "PL-27",
      "PL-24",
      "PL-22",
      "PL-21",
      "PL-20"
    ]
  },
  {
    "id": "PL-22",
    "neighbours": [
      "PL-37",
      "PL-23",
      "PL-21",
      "UA-79",
      "UA-43"
    ]
  },
  {
    "id": "PL-21",
    "neighbours": [
      "PL-24",
      "PL-23",
      "PL-22",
      "PL-20",
      "PL-17",
      "PL-08",
      "PL-05"
    ]
  },
  {
    "id": "PL-20",
    "neighbours": [
      "PL-23",
      "PL-21"
    ]
  },
  {
    "id": "PL-19",
    "neighbours": [
      "PL-18",
      "PL-16",
      "PL-15",
      "PL-12",
      "PL-11"
    ]
  },
  {
    "id": "PL-18",
    "neighbours": [
      "PL-19",
      "PL-17",
      "PL-16",
      "PL-15",
      "PL-12",
      "PL-08",
      "PL-07"
    ]
  },
  {
    "id": "PL-17",
    "neighbours": [
      "PL-21",
      "PL-18",
      "PL-16",
      "PL-08",
      "PL-07"
    ]
  },
  {
    "id": "PL-16",
    "neighbours": [
      "PL-19",
      "PL-18",
      "PL-17",
      "PL-15",
      "LT-07",
      "LT-06"
    ]
  },
  {
    "id": "PL-15",
    "neighbours": [
      "PL-16"
    ]
  },
  {
    "id": "PL-14",
    "neighbours": [
      "PL-87",
      "PL-86",
      "PL-82",
      "PL-13",
      "PL-11"
    ]
  },
  {
    "id": "PL-13",
    "neighbours": [
      "PL-87",
      "PL-86",
      "PL-14",
      "PL-12",
      "PL-11",
      "PL-10",
      "PL-09",
      "PL-06"
    ]
  },
  {
    "id": "PL-12",
    "neighbours": [
      "PL-19",
      "PL-18",
      "PL-13",
      "PL-11",
      "PL-10",
      "PL-07",
      "PL-06"
    ]
  },
  {
    "id": "PL-11",
    "neighbours": [
      "PL-19",
      "PL-16",
      "PL-14",
      "PL-13",
      "PL-12",
      "PL-10"
    ]
  },
  {
    "id": "PL-10",
    "neighbours": [
      "PL-13",
      "PL-12",
      "PL-11"
    ]
  },
  {
    "id": "PL-09",
    "neighbours": [
      "PL-99",
      "PL-95",
      "PL-87",
      "PL-13",
      "PL-06",
      "PL-05"
    ]
  },
  {
    "id": "PL-08",
    "neighbours": [
      "PL-26",
      "PL-24",
      "PL-21",
      "PL-18",
      "PL-17",
      "PL-07",
      "PL-05"
    ]
  },
  {
    "id": "PL-07",
    "neighbours": [
      "PL-18",
      "PL-12",
      "PL-08",
      "PL-06",
      "PL-05"
    ]
  },
  {
    "id": "PL-06",
    "neighbours": [
      "PL-13",
      "PL-12",
      "PL-09",
      "PL-07",
      "PL-05"
    ]
  },
  {
    "id": "PL-05",
    "neighbours": [
      "PL-95",
      "PL-26",
      "PL-21",
      "PL-09",
      "PL-08",
      "PL-07",
      "PL-06",
      "PL-00-04"
    ]
  },
  {
    "id": "PL-00-04",
    "neighbours": [
      "PL-05"
    ]
  },
  {
    "id": "AT-99",
    "neighbours": [
      "AT-98",
      "AT-97",
      "AT-96",
      "AT-62",
      "AT-57",
      "AT-56",
      "IT-39",
      "IT-32"
    ]
  },
  {
    "id": "AT-98",
    "neighbours": [
      "AT-99",
      "AT-97",
      "AT-95",
      "AT-93",
      "AT-88",
      "AT-57",
      "AT-56",
      "AT-55"
    ]
  },
  {
    "id": "AT-97",
    "neighbours": [
      "AT-99",
      "AT-98",
      "AT-96",
      "AT-95",
      "AT-92"
    ]
  },
  {
    "id": "AT-96",
    "neighbours": [
      "SI-04",
      "AT-99",
      "AT-97",
      "AT-95",
      "IT-33",
      "IT-32"
    ]
  },
  {
    "id": "AT-95",
    "neighbours": [
      "SI-04",
      "AT-98",
      "AT-97",
      "AT-96",
      "AT-93",
      "AT-92",
      "AT-91",
      "AT-90",
      "AT-88",
      "AT-55",
      "IT-33"
    ]
  },
  {
    "id": "AT-94",
    "neighbours": [
      "SI-02",
      "AT-93",
      "AT-91",
      "AT-88",
      "AT-87",
      "AT-85"
    ]
  },
  {
    "id": "AT-93",
    "neighbours": [
      "AT-95",
      "AT-94",
      "AT-91",
      "AT-90",
      "AT-88",
      "AT-87"
    ]
  },
  {
    "id": "AT-92",
    "neighbours": [
      "AT-95",
      "AT-91",
      "AT-90"
    ]
  },
  {
    "id": "AT-91",
    "neighbours": [
      "SI-04",
      "SI-03",
      "SI-02",
      "SI-01",
      "AT-95",
      "AT-94",
      "AT-93",
      "AT-90",
      "AT-85"
    ]
  },
  {
    "id": "AT-90",
    "neighbours": [
      "AT-95",
      "AT-93",
      "AT-92",
      "AT-91"
    ]
  },
  {
    "id": "AT-89",
    "neighbours": [
      "AT-88",
      "AT-87",
      "AT-86",
      "AT-56",
      "AT-55",
      "AT-54",
      "AT-53",
      "AT-48",
      "AT-46",
      "AT-45",
      "AT-44",
      "AT-33",
      "AT-32",
      "AT-31"
    ]
  },
  {
    "id": "AT-88",
    "neighbours": [
      "AT-98",
      "AT-95",
      "AT-94",
      "AT-93",
      "AT-89",
      "AT-87",
      "AT-55"
    ]
  },
  {
    "id": "AT-87",
    "neighbours": [
      "AT-94",
      "AT-93",
      "AT-89",
      "AT-88",
      "AT-86",
      "AT-85",
      "AT-81",
      "AT-45"
    ]
  },
  {
    "id": "AT-86",
    "neighbours": [
      "AT-89",
      "AT-87",
      "AT-82",
      "AT-81",
      "AT-74",
      "AT-33",
      "AT-32",
      "AT-31",
      "AT-28",
      "AT-26"
    ]
  },
  {
    "id": "AT-85",
    "neighbours": [
      "SI-02",
      "AT-94",
      "AT-87",
      "AT-84",
      "AT-81",
      "AT-80"
    ]
  },
  {
    "id": "AT-84",
    "neighbours": [
      "SI-09",
      "SI-02",
      "AT-85",
      "AT-81",
      "AT-80"
    ]
  },
  {
    "id": "AT-83",
    "neighbours": [
      "SI-09",
      "AT-84",
      "AT-82",
      "AT-81",
      "AT-80",
      "AT-75",
      "HU-09"
    ]
  },
  {
    "id": "AT-82",
    "neighbours": [
      "AT-86",
      "AT-83",
      "AT-81",
      "AT-80",
      "AT-75",
      "AT-74",
      "AT-28",
      "HU-09"
    ]
  },
  {
    "id": "AT-81",
    "neighbours": [
      "AT-87",
      "AT-86",
      "AT-85",
      "AT-82",
      "AT-80"
    ]
  },
  {
    "id": "AT-80",
    "neighbours": [
      "SI-09",
      "AT-85",
      "AT-84",
      "AT-83",
      "AT-81"
    ]
  },
  {
    "id": "AT-75",
    "neighbours": [
      "AT-83",
      "AT-82",
      "AT-74",
      "HU-09"
    ]
  },
  {
    "id": "AT-74",
    "neighbours": [
      "AT-82",
      "AT-75",
      "AT-73",
      "AT-28",
      "HU-09"
    ]
  },
  {
    "id": "AT-73",
    "neighbours": [
      "AT-74",
      "AT-72",
      "AT-28",
      "HU-09"
    ]
  },
  {
    "id": "AT-72",
    "neighbours": [
      "AT-73",
      "AT-70",
      "AT-28",
      "AT-27",
      "AT-24"
    ]
  },
  {
    "id": "AT-71",
    "neighbours": [
      "AT-70",
      "AT-24",
      "HU-09"
    ]
  },
  {
    "id": "AT-70",
    "neighbours": [
      "AT-72",
      "AT-71",
      "AT-28",
      "AT-27",
      "AT-24",
      "HU-09"
    ]
  },
  {
    "id": "AT-69",
    "neighbours": [
      "CH-09",
      "AT-67",
      "AT-66",
      "DE-88",
      "DE-87"
    ]
  },
  {
    "id": "AT-68",
    "neighbours": [
      "CH-09",
      "AT-69",
      "AT-67",
      "AT-66",
      "DE-87"
    ]
  },
  {
    "id": "AT-67",
    "neighbours": [
      "CH-09",
      "CH-07",
      "AT-69",
      "AT-68",
      "AT-66",
      "AT-65",
      "DE-87"
    ]
  },
  {
    "id": "AT-66",
    "neighbours": [
      "AT-67",
      "AT-65",
      "AT-64",
      "AT-63",
      "AT-61",
      "DE-87",
      "DE-82"
    ]
  },
  {
    "id": "AT-65",
    "neighbours": [
      "CH-07",
      "AT-67",
      "AT-66",
      "AT-64",
      "IT-39"
    ]
  },
  {
    "id": "AT-64",
    "neighbours": [
      "AT-66",
      "AT-65",
      "AT-63",
      "AT-61",
      "IT-39",
      "DE-82"
    ]
  },
  {
    "id": "AT-63",
    "neighbours": [
      "AT-66",
      "AT-64",
      "AT-62",
      "AT-61",
      "AT-57",
      "AT-50",
      "DE-83",
      "DE-82"
    ]
  },
  {
    "id": "AT-62",
    "neighbours": [
      "AT-99",
      "AT-63",
      "AT-61",
      "AT-57",
      "IT-39",
      "DE-83",
      "DE-82"
    ]
  },
  {
    "id": "AT-61",
    "neighbours": [
      "AT-64",
      "AT-63",
      "AT-62",
      "AT-60",
      "IT-39",
      "DE-82"
    ]
  },
  {
    "id": "AT-60",
    "neighbours": [
      "AT-62",
      "AT-61"
    ]
  },
  {
    "id": "AT-57",
    "neighbours": [
      "AT-99",
      "AT-98",
      "AT-63",
      "AT-62",
      "AT-56",
      "AT-55",
      "AT-54",
      "AT-50",
      "IT-39",
      "DE-83"
    ]
  },
  {
    "id": "AT-56",
    "neighbours": [
      "AT-99",
      "AT-98",
      "AT-57",
      "AT-55",
      "AT-54"
    ]
  },
  {
    "id": "AT-55",
    "neighbours": [
      "AT-98",
      "AT-95",
      "AT-93",
      "AT-89",
      "AT-88",
      "AT-56",
      "AT-54",
      "AT-48"
    ]
  },
  {
    "id": "AT-54",
    "neighbours": [
      "AT-57",
      "AT-56",
      "AT-55",
      "AT-53",
      "AT-50",
      "AT-48",
      "DE-83"
    ]
  },
  {
    "id": "AT-53",
    "neighbours": [
      "AT-54",
      "AT-52",
      "AT-51",
      "AT-50",
      "AT-48"
    ]
  },
  {
    "id": "AT-52",
    "neighbours": [
      "AT-53",
      "AT-51",
      "AT-50",
      "AT-49",
      "AT-48",
      "DE-84"
    ]
  },
  {
    "id": "AT-51",
    "neighbours": [
      "AT-53",
      "AT-52",
      "AT-50",
      "AT-49",
      "DE-84",
      "DE-83"
    ]
  },
  {
    "id": "AT-50",
    "neighbours": [
      "AT-63",
      "AT-57",
      "AT-53",
      "AT-52",
      "AT-51",
      "DE-83"
    ]
  },
  {
    "id": "AT-49",
    "neighbours": [
      "AT-52",
      "AT-48",
      "AT-47",
      "AT-46",
      "DE-94",
      "DE-84"
    ]
  },
  {
    "id": "AT-48",
    "neighbours": [
      "AT-89",
      "AT-55",
      "AT-54",
      "AT-53",
      "AT-52",
      "AT-49",
      "AT-46"
    ]
  },
  {
    "id": "AT-47",
    "neighbours": [
      "AT-49",
      "AT-46",
      "AT-41",
      "AT-00",
      "DE-94"
    ]
  },
  {
    "id": "AT-46",
    "neighbours": [
      "AT-89",
      "AT-49",
      "AT-48",
      "AT-47",
      "AT-45",
      "AT-41",
      "AT-00"
    ]
  },
  {
    "id": "AT-45",
    "neighbours": [
      "AT-89",
      "AT-87",
      "AT-46",
      "AT-44",
      "AT-00"
    ]
  },
  {
    "id": "AT-44",
    "neighbours": [
      "AT-89",
      "AT-45",
      "AT-43",
      "AT-42",
      "AT-00",
      "AT-33"
    ]
  },
  {
    "id": "AT-43",
    "neighbours": [
      "AT-44",
      "AT-42",
      "AT-00",
      "AT-39",
      "AT-36",
      "AT-33"
    ]
  },
  {
    "id": "AT-42",
    "neighbours": [
      "CZ-38",
      "AT-44",
      "AT-43",
      "AT-41",
      "AT-00",
      "AT-39"
    ]
  },
  {
    "id": "AT-41",
    "neighbours": [
      "CZ-38",
      "AT-47",
      "AT-42",
      "AT-00",
      "DE-94"
    ]
  },
  {
    "id": "AT-00",
    "neighbours": [
      "AT-47",
      "AT-46",
      "AT-45",
      "AT-44",
      "AT-43",
      "AT-42",
      "AT-41",
      "DE-94"
    ]
  },
  {
    "id": "AT-39",
    "neighbours": [
      "CZ-38",
      "CZ-37",
      "AT-43",
      "AT-42",
      "AT-38",
      "AT-36",
      "AT-35"
    ]
  },
  {
    "id": "AT-38",
    "neighbours": [
      "CZ-67",
      "CZ-37",
      "AT-39",
      "AT-37",
      "AT-35",
      "AT-20"
    ]
  },
  {
    "id": "AT-37",
    "neighbours": [
      "AT-38",
      "AT-35",
      "AT-34",
      "AT-20"
    ]
  },
  {
    "id": "AT-36",
    "neighbours": [
      "AT-43",
      "AT-39",
      "AT-35",
      "AT-34",
      "AT-33",
      "AT-32",
      "AT-31"
    ]
  },
  {
    "id": "AT-35",
    "neighbours": [
      "AT-39",
      "AT-38",
      "AT-37",
      "AT-36",
      "AT-34",
      "AT-31",
      "AT-20"
    ]
  },
  {
    "id": "AT-34",
    "neighbours": [
      "AT-37",
      "AT-35",
      "AT-31",
      "AT-30",
      "AT-22",
      "AT-21",
      "AT-20",
      "AT-10-12"
    ]
  },
  {
    "id": "AT-33",
    "neighbours": [
      "AT-89",
      "AT-45",
      "AT-44",
      "AT-43",
      "AT-36",
      "AT-35",
      "AT-32",
      "AT-31"
    ]
  },
  {
    "id": "AT-32",
    "neighbours": [
      "AT-89",
      "AT-86",
      "AT-36",
      "AT-33",
      "AT-31",
      "AT-30"
    ]
  },
  {
    "id": "AT-31",
    "neighbours": [
      "AT-86",
      "AT-36",
      "AT-35",
      "AT-34",
      "AT-33",
      "AT-32",
      "AT-30",
      "AT-27",
      "AT-26",
      "AT-25"
    ]
  },
  {
    "id": "AT-30",
    "neighbours": [
      "AT-34",
      "AT-31",
      "AT-25",
      "AT-23",
      "AT-10-12"
    ]
  },
  {
    "id": "AT-28",
    "neighbours": [
      "AT-86",
      "AT-82",
      "AT-74",
      "AT-73",
      "AT-72",
      "AT-27",
      "AT-26",
      "AT-24"
    ]
  },
  {
    "id": "AT-27",
    "neighbours": [
      "AT-72",
      "AT-70",
      "AT-31",
      "AT-28",
      "AT-26",
      "AT-25",
      "AT-24"
    ]
  },
  {
    "id": "AT-26",
    "neighbours": [
      "AT-86",
      "AT-72",
      "AT-70",
      "AT-31",
      "AT-28",
      "AT-27",
      "AT-25",
      "AT-24"
    ]
  },
  {
    "id": "AT-25",
    "neighbours": [
      "AT-31",
      "AT-30",
      "AT-27",
      "AT-26",
      "AT-24",
      "AT-23"
    ]
  },
  {
    "id": "AT-24",
    "neighbours": [
      "SK-93",
      "SK-90",
      "SK-81-85",
      "AT-71",
      "AT-70",
      "AT-27",
      "AT-26",
      "AT-25",
      "AT-23",
      "AT-22",
      "AT-10-12",
      "HU-09"
    ]
  },
  {
    "id": "AT-23",
    "neighbours": [
      "AT-30",
      "AT-25",
      "AT-24",
      "AT-22",
      "AT-10-12"
    ]
  },
  {
    "id": "AT-22",
    "neighbours": [
      "CZ-69",
      "SK-90",
      "SK-81-85",
      "AT-34",
      "AT-24",
      "AT-23",
      "AT-21",
      "AT-10-12"
    ]
  },
  {
    "id": "AT-21",
    "neighbours": [
      "CZ-69",
      "CZ-67",
      "AT-34",
      "AT-22",
      "AT-20",
      "AT-10-12"
    ]
  },
  {
    "id": "AT-20",
    "neighbours": [
      "CZ-67",
      "CZ-66",
      "CZ-37",
      "AT-38",
      "AT-37",
      "AT-34",
      "AT-22",
      "AT-21",
      "AT-10-12"
    ]
  },
  {
    "id": "AT-10-12",
    "neighbours": [
      "AT-34",
      "AT-30",
      "AT-23",
      "AT-22",
      "AT-21"
    ]
  },
  {
    "id": "UA-99",
    "neighbours": [
      "UA-73"
    ]
  },
  {
    "id": "UA-91",
    "neighbours": [
      "UA-83",
      "UA-61"
    ]
  },
  {
    "id": "UA-88",
    "neighbours": [
      "SK-07",
      "SK-06",
      "RO-44",
      "RO-43",
      "PL-38",
      "UA-79",
      "UA-76",
      "UA-58",
      "HU-04",
      "HU-03"
    ]
  },
  {
    "id": "UA-83",
    "neighbours": [
      "UA-91",
      "UA-69",
      "UA-61",
      "UA-49"
    ]
  },
  {
    "id": "UA-79",
    "neighbours": [
      "SK-06",
      "PL-38",
      "PL-37",
      "PL-22",
      "UA-88",
      "UA-76",
      "UA-46",
      "UA-43",
      "UA-33"
    ]
  },
  {
    "id": "UA-76",
    "neighbours": [
      "RO-72",
      "RO-43",
      "RO-42",
      "UA-88",
      "UA-79",
      "UA-58",
      "UA-46"
    ]
  },
  {
    "id": "UA-73",
    "neighbours": [
      "UA-99",
      "UA-69",
      "UA-54",
      "UA-49"
    ]
  },
  {
    "id": "UA-69",
    "neighbours": [
      "UA-99",
      "UA-83",
      "UA-73",
      "UA-49"
    ]
  },
  {
    "id": "UA-68",
    "neighbours": [
      "RO-82",
      "RO-81",
      "RO-80",
      "UA-65",
      "MD-77",
      "MD-74",
      "MD-67",
      "MD-61",
      "MD-57",
      "MD-53",
      "MD-43",
      "MD-42",
      "MD-41",
      "MD-38",
      "MD-33"
    ]
  },
  {
    "id": "UA-65",
    "neighbours": [
      "UA-68",
      "UA-54",
      "UA-25",
      "UA-21",
      "UA-18",
      "MD-72",
      "MD-66",
      "MD-65",
      "MD-57",
      "MD-55",
      "MD-54",
      "MD-45",
      "MD-43",
      "MD-42",
      "MD-40",
      "MD-35",
      "MD-33",
      "MD-32"
    ]
  },
  {
    "id": "UA-61",
    "neighbours": [
      "UA-91",
      "UA-83",
      "UA-49",
      "UA-40",
      "UA-36"
    ]
  },
  {
    "id": "UA-58",
    "neighbours": [
      "RO-72",
      "RO-71",
      "RO-43",
      "RO-42",
      "UA-88",
      "UA-76",
      "UA-46",
      "UA-29",
      "UA-21",
      "MD-71",
      "MD-47"
    ]
  },
  {
    "id": "UA-54",
    "neighbours": [
      "UA-73",
      "UA-65",
      "UA-49",
      "UA-25",
      "UA-21"
    ]
  },
  {
    "id": "UA-49",
    "neighbours": [
      "UA-83",
      "UA-73",
      "UA-69",
      "UA-61",
      "UA-54",
      "UA-36",
      "UA-25"
    ]
  },
  {
    "id": "UA-46",
    "neighbours": [
      "UA-79",
      "UA-76",
      "UA-58",
      "UA-33",
      "UA-29"
    ]
  },
  {
    "id": "UA-43",
    "neighbours": [
      "PL-22",
      "PL-21",
      "UA-79",
      "UA-33"
    ]
  },
  {
    "id": "UA-40",
    "neighbours": [
      "UA-61",
      "UA-36",
      "UA-14"
    ]
  },
  {
    "id": "UA-36",
    "neighbours": [
      "UA-61",
      "UA-49",
      "UA-40",
      "UA-25",
      "UA-18",
      "UA-14",
      "UA-01"
    ]
  },
  {
    "id": "UA-33",
    "neighbours": [
      "UA-79",
      "UA-46",
      "UA-43",
      "UA-29",
      "UA-10"
    ]
  },
  {
    "id": "UA-29",
    "neighbours": [
      "RO-71",
      "UA-58",
      "UA-46",
      "UA-33",
      "UA-21",
      "UA-10",
      "MD-71",
      "MD-47",
      "MD-46"
    ]
  },
  {
    "id": "UA-25",
    "neighbours": [
      "UA-65",
      "UA-54",
      "UA-49",
      "UA-36",
      "UA-21",
      "UA-18"
    ]
  },
  {
    "id": "UA-21",
    "neighbours": [
      "UA-65",
      "UA-58",
      "UA-29",
      "UA-25",
      "UA-18",
      "UA-10",
      "UA-01",
      "MD-72",
      "MD-71",
      "MD-66",
      "MD-62",
      "MD-55",
      "MD-54",
      "MD-52",
      "MD-51",
      "MD-50",
      "MD-47",
      "MD-46",
      "MD-30"
    ]
  },
  {
    "id": "UA-18",
    "neighbours": [
      "UA-36",
      "UA-25",
      "UA-21",
      "UA-14",
      "UA-01"
    ]
  },
  {
    "id": "UA-14",
    "neighbours": [
      "UA-40",
      "UA-36",
      "UA-18",
      "UA-01"
    ]
  },
  {
    "id": "UA-10",
    "neighbours": [
      "UA-33",
      "UA-29",
      "UA-21",
      "UA-01"
    ]
  },
  {
    "id": "UA-01",
    "neighbours": [
      "UA-36",
      "UA-21",
      "UA-18",
      "UA-14",
      "UA-10"
    ]
  },
  {
    "id": "NO-09",
    "neighbours": [
      "SE-98",
      "NO-08",
      "FI-99"
    ]
  },
  {
    "id": "NO-08",
    "neighbours": [
      "SE-98",
      "SE-96",
      "SE-93",
      "SE-92",
      "SE-91",
      "SE-83",
      "NO-07"
    ]
  },
  {
    "id": "NO-07",
    "neighbours": [
      "SE-92",
      "SE-84",
      "SE-83",
      "NO-08",
      "NO-06",
      "NO-02"
    ]
  },
  {
    "id": "NO-06",
    "neighbours": [
      "NO-07",
      "NO-05",
      "NO-03",
      "NO-02"
    ]
  },
  {
    "id": "NO-05",
    "neighbours": [
      "NO-06",
      "NO-04",
      "NO-03"
    ]
  },
  {
    "id": "NO-04",
    "neighbours": [
      "NO-05",
      "NO-03"
    ]
  },
  {
    "id": "NO-03",
    "neighbours": [
      "SE-45",
      "NO-06",
      "NO-05",
      "NO-04",
      "NO-02",
      "NO-01",
      "NO-00"
    ]
  },
  {
    "id": "NO-02",
    "neighbours": [
      "SE-84",
      "SE-79",
      "SE-78",
      "SE-68",
      "SE-67",
      "SE-66",
      "NO-07",
      "NO-06",
      "NO-03",
      "NO-01",
      "NO-00"
    ]
  },
  {
    "id": "NO-01",
    "neighbours": [
      "SE-67",
      "SE-66",
      "SE-45",
      "NO-03",
      "NO-02",
      "NO-00"
    ]
  },
  {
    "id": "NO-00",
    "neighbours": [
      "NO-03",
      "NO-02",
      "NO-01"
    ]
  },
  {
    "id": "NL-09",
    "neighbours": [
      "NL-08",
      "NL-07",
      "DE-49",
      "DE-26"
    ]
  },
  {
    "id": "NL-08",
    "neighbours": [
      "NL-09",
      "NL-07",
      "NL-06",
      "NL-03",
      "NL-01"
    ]
  },
  {
    "id": "NL-07",
    "neighbours": [
      "NL-09",
      "NL-08",
      "NL-06",
      "NL-03",
      "DE-49",
      "DE-48",
      "DE-47",
      "DE-46"
    ]
  },
  {
    "id": "NL-06",
    "neighbours": [
      "NL-08",
      "NL-07",
      "NL-05",
      "NL-04",
      "NL-03",
      "DE-52",
      "DE-47",
      "DE-46",
      "DE-41",
      "BE-04",
      "BE-03"
    ]
  },
  {
    "id": "NL-05",
    "neighbours": [
      "NL-06",
      "NL-04",
      "NL-02",
      "DE-47",
      "DE-41",
      "BE-03",
      "BE-02"
    ]
  },
  {
    "id": "NL-04",
    "neighbours": [
      "NL-07",
      "NL-06",
      "NL-05",
      "NL-03",
      "BE-09",
      "BE-08",
      "BE-02"
    ]
  },
  {
    "id": "NL-03",
    "neighbours": [
      "NL-08",
      "NL-07",
      "NL-06",
      "NL-04",
      "NL-02",
      "NL-01"
    ]
  },
  {
    "id": "NL-02",
    "neighbours": [
      "NL-03",
      "NL-01"
    ]
  },
  {
    "id": "NL-01",
    "neighbours": [
      "NL-03",
      "NL-02"
    ]
  },
  {
    "id": "ME-85",
    "neighbours": [
      "ME-81",
      "HR-02",
      "BA-89",
      "BA-88",
      "AL-04"
    ]
  },
  {
    "id": "ME-84",
    "neighbours": [
      "RS-38",
      "RS-36",
      "RS-31",
      "ME-81",
      "BA-73",
      "AL-08",
      "AL-04"
    ]
  },
  {
    "id": "ME-81",
    "neighbours": [
      "ME-85",
      "ME-84",
      "BA-89",
      "BA-88",
      "BA-73",
      "AL-04"
    ]
  },
  {
    "id": "MD-77",
    "neighbours": [
      "UA-68",
      "MD-68",
      "MD-67",
      "MD-65",
      "MD-43",
      "MD-41",
      "MD-34"
    ]
  },
  {
    "id": "MD-74",
    "neighbours": [
      "UA-68",
      "MD-61",
      "MD-53",
      "MD-39"
    ]
  },
  {
    "id": "MD-73",
    "neighbours": [
      "RO-80",
      "RO-73",
      "MD-74",
      "MD-63",
      "MD-39",
      "MD-38"
    ]
  },
  {
    "id": "MD-72",
    "neighbours": [
      "MD-66",
      "MD-58",
      "MD-55",
      "MD-54",
      "MD-50"
    ]
  },
  {
    "id": "MD-71",
    "neighbours": [
      "UA-58",
      "UA-21",
      "MD-51",
      "MD-47",
      "MD-46"
    ]
  },
  {
    "id": "MD-68",
    "neighbours": [
      "MD-77",
      "MD-65",
      "MD-41",
      "MD-37",
      "MD-34",
      "MD-20"
    ]
  },
  {
    "id": "MD-67",
    "neighbours": [
      "UA-68",
      "MD-77",
      "MD-61",
      "MD-41",
      "MD-38"
    ]
  },
  {
    "id": "MD-66",
    "neighbours": [
      "UA-65",
      "UA-21",
      "MD-72",
      "MD-55",
      "MD-50",
      "MD-30"
    ]
  },
  {
    "id": "MD-65",
    "neighbours": [
      "MD-77",
      "MD-68",
      "MD-57",
      "MD-48",
      "MD-43",
      "MD-40",
      "MD-32",
      "MD-20"
    ]
  },
  {
    "id": "MD-64",
    "neighbours": [
      "RO-70",
      "MD-44",
      "MD-37",
      "MD-36",
      "MD-34"
    ]
  },
  {
    "id": "MD-63",
    "neighbours": [
      "RO-73",
      "MD-73",
      "MD-41",
      "MD-38",
      "MD-34"
    ]
  },
  {
    "id": "MD-62",
    "neighbours": [
      "MD-59",
      "MD-58",
      "MD-52",
      "MD-50",
      "MD-36"
    ]
  },
  {
    "id": "MD-61",
    "neighbours": [
      "UA-68",
      "MD-74",
      "MD-67",
      "MD-38"
    ]
  },
  {
    "id": "MD-59",
    "neighbours": [
      "RO-71",
      "RO-70",
      "MD-62",
      "MD-56",
      "MD-49",
      "MD-36"
    ]
  },
  {
    "id": "MD-58",
    "neighbours": [
      "MD-72",
      "MD-62",
      "MD-54",
      "MD-50",
      "MD-44",
      "MD-36",
      "MD-35"
    ]
  },
  {
    "id": "MD-57",
    "neighbours": [
      "UA-65",
      "MD-65",
      "MD-43",
      "MD-42",
      "MD-40",
      "MD-33",
      "MD-32"
    ]
  },
  {
    "id": "MD-56",
    "neighbours": [
      "RO-71",
      "MD-62",
      "MD-52",
      "MD-51",
      "MD-49",
      "MD-46"
    ]
  },
  {
    "id": "MD-55",
    "neighbours": [
      "UA-65",
      "MD-72",
      "MD-66",
      "MD-54",
      "MD-45",
      "MD-35"
    ]
  },
  {
    "id": "MD-54",
    "neighbours": [
      "MD-72",
      "MD-58",
      "MD-55",
      "MD-35"
    ]
  },
  {
    "id": "MD-53",
    "neighbours": [
      "RO-80",
      "UA-68",
      "MD-74",
      "MD-39"
    ]
  },
  {
    "id": "MD-52",
    "neighbours": [
      "MD-62",
      "MD-56",
      "MD-51",
      "MD-50",
      "MD-30"
    ]
  },
  {
    "id": "MD-51",
    "neighbours": [
      "UA-21",
      "MD-71",
      "MD-56",
      "MD-52",
      "MD-46",
      "MD-30"
    ]
  },
  {
    "id": "MD-50",
    "neighbours": [
      "MD-72",
      "MD-66",
      "MD-62",
      "MD-58",
      "MD-52",
      "MD-30"
    ]
  },
  {
    "id": "MD-49",
    "neighbours": [
      "RO-71",
      "RO-70",
      "MD-59",
      "MD-56"
    ]
  },
  {
    "id": "MD-48",
    "neighbours": [
      "MD-65",
      "MD-45",
      "MD-40",
      "MD-37",
      "MD-35",
      "MD-20"
    ]
  },
  {
    "id": "MD-47",
    "neighbours": [
      "RO-71",
      "UA-58",
      "MD-71",
      "MD-46"
    ]
  },
  {
    "id": "MD-46",
    "neighbours": [
      "RO-71",
      "MD-71",
      "MD-56",
      "MD-51",
      "MD-47"
    ]
  },
  {
    "id": "MD-45",
    "neighbours": [
      "UA-65",
      "MD-65",
      "MD-55",
      "MD-48",
      "MD-40",
      "MD-35",
      "MD-20"
    ]
  },
  {
    "id": "MD-44",
    "neighbours": [
      "MD-64",
      "MD-58",
      "MD-37",
      "MD-36",
      "MD-35"
    ]
  },
  {
    "id": "MD-43",
    "neighbours": [
      "UA-68",
      "MD-77",
      "MD-65",
      "MD-57",
      "MD-42",
      "MD-33",
      "MD-32"
    ]
  },
  {
    "id": "MD-42",
    "neighbours": [
      "UA-68",
      "UA-65",
      "MD-57",
      "MD-43",
      "MD-33"
    ]
  },
  {
    "id": "MD-41",
    "neighbours": [
      "MD-77",
      "MD-68",
      "MD-67",
      "MD-63",
      "MD-38",
      "MD-34"
    ]
  },
  {
    "id": "MD-40",
    "neighbours": [
      "UA-65",
      "MD-65",
      "MD-57",
      "MD-48",
      "MD-45",
      "MD-33",
      "MD-32"
    ]
  },
  {
    "id": "MD-39",
    "neighbours": [
      "RO-80",
      "MD-74",
      "MD-73",
      "MD-53",
      "MD-38"
    ]
  },
  {
    "id": "MD-38",
    "neighbours": [
      "MD-74",
      "MD-73",
      "MD-67",
      "MD-63",
      "MD-61",
      "MD-41",
      "MD-39"
    ]
  },
  {
    "id": "MD-37",
    "neighbours": [
      "MD-68",
      "MD-64",
      "MD-48",
      "MD-44",
      "MD-35",
      "MD-34",
      "MD-20"
    ]
  },
  {
    "id": "MD-36",
    "neighbours": [
      "RO-70",
      "MD-64",
      "MD-62",
      "MD-59",
      "MD-58",
      "MD-44"
    ]
  },
  {
    "id": "MD-35",
    "neighbours": [
      "UA-65",
      "MD-58",
      "MD-55",
      "MD-54",
      "MD-48",
      "MD-45",
      "MD-44",
      "MD-37"
    ]
  },
  {
    "id": "MD-34",
    "neighbours": [
      "RO-73",
      "RO-70",
      "MD-77",
      "MD-68",
      "MD-64",
      "MD-63",
      "MD-41",
      "MD-37",
      "MD-20"
    ]
  },
  {
    "id": "MD-33",
    "neighbours": [
      "MD-57",
      "MD-42",
      "MD-40"
    ]
  },
  {
    "id": "MD-32",
    "neighbours": [
      "MD-65",
      "MD-57",
      "MD-43",
      "MD-40"
    ]
  },
  {
    "id": "MD-30",
    "neighbours": [
      "UA-21",
      "MD-66",
      "MD-52",
      "MD-51",
      "MD-50"
    ]
  },
  {
    "id": "MD-20",
    "neighbours": [
      "MD-77",
      "MD-68",
      "MD-65",
      "MD-48",
      "MD-45",
      "MD-37"
    ]
  },
  {
    "id": "MK-75",
    "neighbours": [
      "MK-72",
      "MK-65",
      "MK-62",
      "MK-14"
    ]
  },
  {
    "id": "MK-73",
    "neighbours": [
      "MK-72",
      "MK-63",
      "MK-60"
    ]
  },
  {
    "id": "MK-72",
    "neighbours": [
      "MK-75",
      "MK-73",
      "MK-65",
      "MK-63",
      "MK-62",
      "MK-60",
      "MK-14"
    ]
  },
  {
    "id": "MK-65",
    "neighbours": [
      "MK-75",
      "MK-72",
      "MK-62",
      "MK-14",
      "MK-12",
      "MK-10"
    ]
  },
  {
    "id": "MK-63",
    "neighbours": [
      "MK-73",
      "MK-72",
      "MK-62",
      "MK-60",
      "MK-12",
      "AL-08",
      "AL-07",
      "AL-03"
    ]
  },
  {
    "id": "MK-62",
    "neighbours": [
      "MK-75",
      "MK-72",
      "MK-65",
      "MK-63",
      "MK-12"
    ]
  },
  {
    "id": "MK-60",
    "neighbours": [
      "MK-73",
      "MK-72",
      "MK-63",
      "AL-07"
    ]
  },
  {
    "id": "MK-24",
    "neighbours": [
      "MK-23",
      "MK-22",
      "MK-20",
      "MK-14",
      "BG-02"
    ]
  },
  {
    "id": "MK-23",
    "neighbours": [
      "MK-24",
      "MK-22",
      "MK-20",
      "MK-13",
      "BG-02"
    ]
  },
  {
    "id": "MK-22",
    "neighbours": [
      "MK-24",
      "MK-23",
      "MK-20",
      "MK-14",
      "MK-13",
      "MK-10"
    ]
  },
  {
    "id": "MK-20",
    "neighbours": [
      "MK-24",
      "MK-22",
      "MK-14"
    ]
  },
  {
    "id": "MK-14",
    "neighbours": [
      "MK-75",
      "MK-72",
      "MK-65",
      "MK-24",
      "MK-22",
      "MK-20",
      "MK-13",
      "MK-12",
      "MK-10"
    ]
  },
  {
    "id": "MK-13",
    "neighbours": [
      "RS-17",
      "MK-23",
      "MK-22",
      "MK-10",
      "BG-02"
    ]
  },
  {
    "id": "MK-12",
    "neighbours": [
      "RS-38",
      "MK-65",
      "MK-63",
      "MK-62",
      "MK-10",
      "AL-08",
      "AL-03"
    ]
  },
  {
    "id": "MK-10",
    "neighbours": [
      "RS-38",
      "MK-65",
      "MK-22",
      "MK-14",
      "MK-13",
      "MK-12"
    ]
  },
  {
    "id": "LU-00",
    "neighbours": [
      "FR-57",
      "FR-54",
      "DE-66",
      "DE-54",
      "BE-06",
      "BE-04"
    ]
  },
  {
    "id": "LT-09",
    "neighbours": [
      "LT-08",
      "LT-07",
      "LV-38",
      "LV-34",
      "LV-33"
    ]
  },
  {
    "id": "LT-08",
    "neighbours": [
      "LT-09",
      "LT-07",
      "LT-06",
      "LT-05",
      "LT-04",
      "LT-03",
      "LV-39",
      "LV-38",
      "LV-37",
      "LV-34",
      "LV-33",
      "LV-30"
    ]
  },
  {
    "id": "LT-07",
    "neighbours": [
      "PL-19",
      "PL-16",
      "LT-09",
      "LT-08",
      "LT-06",
      "LT-05"
    ]
  },
  {
    "id": "LT-06",
    "neighbours": [
      "PL-16",
      "LT-08",
      "LT-07",
      "LT-05",
      "LT-04",
      "LT-02"
    ]
  },
  {
    "id": "LT-05",
    "neighbours": [
      "LT-08",
      "LT-07",
      "LT-06",
      "LT-04",
      "LT-03",
      "LT-02",
      "LT-01"
    ]
  },
  {
    "id": "LT-04",
    "neighbours": [
      "LT-05",
      "LT-03",
      "LT-02",
      "LV-54",
      "LV-52",
      "LV-51",
      "LV-50",
      "LV-39"
    ]
  },
  {
    "id": "LT-03",
    "neighbours": [
      "LT-08",
      "LT-05",
      "LT-02",
      "LT-01",
      "LV-54",
      "LV-39",
      "LV-30"
    ]
  },
  {
    "id": "LT-02",
    "neighbours": [
      "LT-06",
      "LT-05",
      "LT-04",
      "LT-03",
      "LT-01",
      "LT-00"
    ]
  },
  {
    "id": "LT-01",
    "neighbours": [
      "LT-06",
      "LT-05",
      "LT-03",
      "LT-02",
      "LT-00"
    ]
  },
  {
    "id": "LT-00",
    "neighbours": [
      "LT-02",
      "LT-01"
    ]
  },
  {
    "id": "LV-57",
    "neighbours": [
      "LV-56",
      "LV-46",
      "LV-45"
    ]
  },
  {
    "id": "LV-56",
    "neighbours": [
      "LV-57",
      "LV-54",
      "LV-53",
      "LV-46"
    ]
  },
  {
    "id": "LV-54",
    "neighbours": [
      "LT-04",
      "LT-03",
      "LV-56",
      "LV-53",
      "LV-52"
    ]
  },
  {
    "id": "LV-53",
    "neighbours": [
      "LV-56",
      "LV-54",
      "LV-52",
      "LV-48",
      "LV-46"
    ]
  },
  {
    "id": "LV-52",
    "neighbours": [
      "LT-04",
      "LV-54",
      "LV-53",
      "LV-51",
      "LV-48",
      "LV-46"
    ]
  },
  {
    "id": "LV-51",
    "neighbours": [
      "LT-04",
      "LV-52",
      "LV-50",
      "LV-48",
      "LV-39"
    ]
  },
  {
    "id": "LV-50",
    "neighbours": [
      "LV-51",
      "LV-48",
      "LV-41",
      "LV-39",
      "LV-21",
      "LV-10"
    ]
  },
  {
    "id": "LV-48",
    "neighbours": [
      "LV-53",
      "LV-52",
      "LV-51",
      "LV-50",
      "LV-46",
      "LV-45",
      "LV-44",
      "LV-41"
    ]
  },
  {
    "id": "LV-47",
    "neighbours": [
      "LV-44",
      "LV-43",
      "LV-42",
      "LV-41",
      "EE-07",
      "EE-06"
    ]
  },
  {
    "id": "LV-46",
    "neighbours": [
      "LV-57",
      "LV-56",
      "LV-53",
      "LV-48",
      "LV-45"
    ]
  },
  {
    "id": "LV-45",
    "neighbours": [
      "LV-57",
      "LV-48",
      "LV-46",
      "LV-44",
      "LV-43"
    ]
  },
  {
    "id": "LV-44",
    "neighbours": [
      "LV-48",
      "LV-47",
      "LV-45",
      "LV-43",
      "LV-41"
    ]
  },
  {
    "id": "LV-43",
    "neighbours": [
      "LV-47",
      "LV-45",
      "LV-44",
      "EE-06"
    ]
  },
  {
    "id": "LV-42",
    "neighbours": [
      "LV-47",
      "LV-41",
      "LV-40",
      "EE-08",
      "EE-07",
      "EE-06"
    ]
  },
  {
    "id": "LV-41",
    "neighbours": [
      "LV-50",
      "LV-48",
      "LV-47",
      "LV-44",
      "LV-42",
      "LV-40",
      "LV-21"
    ]
  },
  {
    "id": "LV-40",
    "neighbours": [
      "LV-42",
      "LV-41",
      "LV-21",
      "EE-08"
    ]
  },
  {
    "id": "LV-39",
    "neighbours": [
      "LT-08",
      "LT-04",
      "LT-03",
      "LV-51",
      "LV-50",
      "LV-30",
      "LV-21"
    ]
  },
  {
    "id": "LV-38",
    "neighbours": [
      "LT-08",
      "LV-37",
      "LV-34",
      "LV-33",
      "LV-32",
      "LV-31"
    ]
  },
  {
    "id": "LV-37",
    "neighbours": [
      "LT-08",
      "LV-38",
      "LV-31",
      "LV-30",
      "LV-20"
    ]
  },
  {
    "id": "LV-36",
    "neighbours": [
      "LV-33",
      "LV-32"
    ]
  },
  {
    "id": "LV-34",
    "neighbours": [
      "LT-09",
      "LT-08",
      "LV-38",
      "LV-36",
      "LV-33"
    ]
  },
  {
    "id": "LV-33",
    "neighbours": [
      "LV-38",
      "LV-36",
      "LV-34",
      "LV-32",
      "LV-31"
    ]
  },
  {
    "id": "LV-32",
    "neighbours": [
      "LV-38",
      "LV-36",
      "LV-33",
      "LV-31"
    ]
  },
  {
    "id": "LV-31",
    "neighbours": [
      "LV-38",
      "LV-37",
      "LV-33",
      "LV-32",
      "LV-30",
      "LV-21",
      "LV-20"
    ]
  },
  {
    "id": "LV-30",
    "neighbours": [
      "LT-08",
      "LV-39",
      "LV-37",
      "LV-31",
      "LV-21",
      "LV-20"
    ]
  },
  {
    "id": "LV-21",
    "neighbours": [
      "LV-50",
      "LV-41",
      "LV-40",
      "LV-39",
      "LV-37",
      "LV-31",
      "LV-30",
      "LV-20",
      "LV-10"
    ]
  },
  {
    "id": "LV-20",
    "neighbours": [
      "LV-31",
      "LV-30",
      "LV-21",
      "LV-10"
    ]
  },
  {
    "id": "LV-10",
    "neighbours": [
      "LV-21",
      "LV-20"
    ]
  },
  {
    "id": "HR-05",
    "neighbours": [
      "SI-08",
      "SI-06",
      "SI-01",
      "HR-04",
      "HR-02",
      "IT-34",
      "BA-80",
      "BA-77"
    ]
  },
  {
    "id": "HR-04",
    "neighbours": [
      "SI-09",
      "SI-08",
      "SI-03",
      "SI-02",
      "SI-01",
      "HR-05",
      "HR-03",
      "HR-01",
      "HU-08",
      "HU-07",
      "BA-79",
      "BA-78",
      "BA-77"
    ]
  },
  {
    "id": "HR-03",
    "neighbours": [
      "RS-25",
      "RS-22",
      "RS-21",
      "RS-15",
      "HR-04",
      "HU-07",
      "HU-06",
      "BA-79",
      "BA-78",
      "BA-76",
      "BA-74"
    ]
  },
  {
    "id": "HR-02",
    "neighbours": [
      "ME-85",
      "HR-05",
      "BA-88",
      "BA-80",
      "BA-77"
    ]
  },
  {
    "id": "HR-01",
    "neighbours": [
      "SI-08",
      "SI-03",
      "HR-04"
    ]
  },
  {
    "id": "IT-98",
    "neighbours": [
      "IT-95",
      "IT-94",
      "IT-90",
      "IT-89"
    ]
  },
  {
    "id": "IT-97",
    "neighbours": [
      "IT-96",
      "IT-95",
      "IT-93"
    ]
  },
  {
    "id": "IT-96",
    "neighbours": [
      "IT-97",
      "IT-95",
      "IT-94"
    ]
  },
  {
    "id": "IT-95",
    "neighbours": [
      "IT-98",
      "IT-97",
      "IT-96",
      "IT-94",
      "IT-93"
    ]
  },
  {
    "id": "IT-94",
    "neighbours": [
      "IT-98",
      "IT-95",
      "IT-93",
      "IT-92",
      "IT-90"
    ]
  },
  {
    "id": "IT-93",
    "neighbours": [
      "IT-97",
      "IT-95",
      "IT-94",
      "IT-92",
      "IT-90"
    ]
  },
  {
    "id": "IT-92",
    "neighbours": [
      "IT-93",
      "IT-91",
      "IT-90"
    ]
  },
  {
    "id": "IT-91",
    "neighbours": [
      "IT-90"
    ]
  },
  {
    "id": "IT-90",
    "neighbours": [
      "IT-98",
      "IT-94",
      "IT-93",
      "IT-92",
      "IT-91"
    ]
  },
  {
    "id": "IT-89",
    "neighbours": [
      "IT-98",
      "IT-88"
    ]
  },
  {
    "id": "IT-88",
    "neighbours": [
      "IT-89",
      "IT-87"
    ]
  },
  {
    "id": "IT-87",
    "neighbours": [
      "IT-88",
      "IT-85",
      "IT-84",
      "IT-75"
    ]
  },
  {
    "id": "IT-86",
    "neighbours": [
      "IT-82",
      "IT-81",
      "IT-71",
      "IT-67",
      "IT-66",
      "IT-03"
    ]
  },
  {
    "id": "IT-85",
    "neighbours": [
      "IT-87",
      "IT-84",
      "IT-83",
      "IT-76",
      "IT-75",
      "IT-71",
      "IT-70"
    ]
  },
  {
    "id": "IT-84",
    "neighbours": [
      "IT-87",
      "IT-85",
      "IT-83",
      "IT-80"
    ]
  },
  {
    "id": "IT-83",
    "neighbours": [
      "IT-85",
      "IT-84",
      "IT-82",
      "IT-81",
      "IT-80",
      "IT-71"
    ]
  },
  {
    "id": "IT-82",
    "neighbours": [
      "IT-86",
      "IT-83",
      "IT-81",
      "IT-80",
      "IT-71"
    ]
  },
  {
    "id": "IT-81",
    "neighbours": [
      "IT-86",
      "IT-82",
      "IT-80",
      "IT-04",
      "IT-03"
    ]
  },
  {
    "id": "IT-80",
    "neighbours": [
      "IT-84",
      "IT-82",
      "IT-81"
    ]
  },
  {
    "id": "IT-76",
    "neighbours": [
      "IT-85",
      "IT-71",
      "IT-70"
    ]
  },
  {
    "id": "IT-75",
    "neighbours": [
      "IT-87",
      "IT-85",
      "IT-76",
      "IT-74",
      "IT-70"
    ]
  },
  {
    "id": "IT-74",
    "neighbours": [
      "IT-75",
      "IT-73",
      "IT-72",
      "IT-70"
    ]
  },
  {
    "id": "IT-73",
    "neighbours": [
      "IT-72"
    ]
  },
  {
    "id": "IT-72",
    "neighbours": [
      "IT-74",
      "IT-73",
      "IT-70"
    ]
  },
  {
    "id": "IT-71",
    "neighbours": [
      "IT-86",
      "IT-85",
      "IT-83",
      "IT-82",
      "IT-76"
    ]
  },
  {
    "id": "IT-70",
    "neighbours": [
      "IT-85",
      "IT-76",
      "IT-75",
      "IT-74",
      "IT-72"
    ]
  },
  {
    "id": "IT-67",
    "neighbours": [
      "IT-86",
      "IT-66",
      "IT-65",
      "IT-64",
      "IT-06",
      "IT-03",
      "IT-02",
      "IT-00"
    ]
  },
  {
    "id": "IT-66",
    "neighbours": [
      "IT-86",
      "IT-67",
      "IT-65",
      "IT-64"
    ]
  },
  {
    "id": "IT-65",
    "neighbours": [
      "IT-67",
      "IT-66",
      "IT-64"
    ]
  },
  {
    "id": "IT-64",
    "neighbours": [
      "IT-67",
      "IT-65",
      "IT-63",
      "IT-02"
    ]
  },
  {
    "id": "IT-63",
    "neighbours": [
      "IT-64",
      "IT-62",
      "IT-06",
      "IT-02"
    ]
  },
  {
    "id": "IT-62",
    "neighbours": [
      "IT-63",
      "IT-60",
      "IT-06"
    ]
  },
  {
    "id": "IT-61",
    "neighbours": [
      "IT-60",
      "IT-52",
      "IT-47",
      "IT-06"
    ]
  },
  {
    "id": "IT-60",
    "neighbours": [
      "IT-62",
      "IT-61",
      "IT-06"
    ]
  },
  {
    "id": "IT-59",
    "neighbours": [
      "IT-51",
      "IT-50",
      "IT-40"
    ]
  },
  {
    "id": "IT-58",
    "neighbours": [
      "IT-57",
      "IT-56",
      "IT-53",
      "IT-01"
    ]
  },
  {
    "id": "IT-57",
    "neighbours": [
      "IT-58",
      "IT-56"
    ]
  },
  {
    "id": "IT-56",
    "neighbours": [
      "IT-58",
      "IT-57",
      "IT-55",
      "IT-53",
      "IT-51",
      "IT-50"
    ]
  },
  {
    "id": "IT-55",
    "neighbours": [
      "IT-56",
      "IT-54",
      "IT-51",
      "IT-50",
      "IT-42",
      "IT-41"
    ]
  },
  {
    "id": "IT-54",
    "neighbours": [
      "IT-55",
      "IT-43",
      "IT-42",
      "IT-19"
    ]
  },
  {
    "id": "IT-53",
    "neighbours": [
      "IT-58",
      "IT-56",
      "IT-52",
      "IT-50",
      "IT-06",
      "IT-05",
      "IT-01"
    ]
  },
  {
    "id": "IT-52",
    "neighbours": [
      "IT-61",
      "IT-53",
      "IT-50",
      "IT-47",
      "IT-06"
    ]
  },
  {
    "id": "IT-51",
    "neighbours": [
      "IT-59",
      "IT-56",
      "IT-55",
      "IT-50",
      "IT-41",
      "IT-40"
    ]
  },
  {
    "id": "IT-50",
    "neighbours": [
      "IT-59",
      "IT-56",
      "IT-55",
      "IT-53",
      "IT-52",
      "IT-51",
      "IT-48",
      "IT-47",
      "IT-40"
    ]
  },
  {
    "id": "IT-48",
    "neighbours": [
      "IT-50",
      "IT-47",
      "IT-44",
      "IT-40"
    ]
  },
  {
    "id": "IT-47",
    "neighbours": [
      "IT-61",
      "IT-52",
      "IT-50",
      "IT-48",
      "IT-40"
    ]
  },
  {
    "id": "IT-46",
    "neighbours": [
      "IT-45",
      "IT-44",
      "IT-43",
      "IT-42",
      "IT-41",
      "IT-37",
      "IT-26",
      "IT-25"
    ]
  },
  {
    "id": "IT-45",
    "neighbours": [
      "IT-46",
      "IT-44",
      "IT-41",
      "IT-37",
      "IT-35",
      "IT-30"
    ]
  },
  {
    "id": "IT-44",
    "neighbours": [
      "IT-48",
      "IT-46",
      "IT-45",
      "IT-41",
      "IT-40"
    ]
  },
  {
    "id": "IT-43",
    "neighbours": [
      "IT-54",
      "IT-46",
      "IT-42",
      "IT-29",
      "IT-26",
      "IT-19",
      "IT-16"
    ]
  },
  {
    "id": "IT-42",
    "neighbours": [
      "IT-55",
      "IT-54",
      "IT-46",
      "IT-43",
      "IT-41",
      "IT-26"
    ]
  },
  {
    "id": "IT-41",
    "neighbours": [
      "IT-55",
      "IT-51",
      "IT-46",
      "IT-45",
      "IT-44",
      "IT-42",
      "IT-40",
      "IT-37"
    ]
  },
  {
    "id": "IT-40",
    "neighbours": [
      "IT-59",
      "IT-55",
      "IT-51",
      "IT-50",
      "IT-48",
      "IT-47",
      "IT-44",
      "IT-41"
    ]
  },
  {
    "id": "IT-39",
    "neighbours": [
      "CH-07",
      "AT-99",
      "AT-96",
      "AT-65",
      "AT-64",
      "AT-62",
      "AT-61",
      "AT-57",
      "IT-38",
      "IT-32",
      "IT-23"
    ]
  },
  {
    "id": "IT-38",
    "neighbours": [
      "IT-39",
      "IT-37",
      "IT-36",
      "IT-32",
      "IT-25",
      "IT-24",
      "IT-23"
    ]
  },
  {
    "id": "IT-37",
    "neighbours": [
      "IT-46",
      "IT-45",
      "IT-44",
      "IT-38",
      "IT-36",
      "IT-35",
      "IT-25"
    ]
  },
  {
    "id": "IT-36",
    "neighbours": [
      "IT-45",
      "IT-38",
      "IT-37",
      "IT-35",
      "IT-32",
      "IT-31"
    ]
  },
  {
    "id": "IT-35",
    "neighbours": [
      "IT-45",
      "IT-37",
      "IT-36",
      "IT-31",
      "IT-30"
    ]
  },
  {
    "id": "IT-34",
    "neighbours": [
      "SI-06",
      "SI-05",
      "IT-33"
    ]
  },
  {
    "id": "IT-33",
    "neighbours": [
      "SI-05",
      "SI-04",
      "AT-99",
      "AT-97",
      "AT-96",
      "AT-95",
      "AT-92",
      "IT-34",
      "IT-32",
      "IT-31",
      "IT-30"
    ]
  },
  {
    "id": "IT-32",
    "neighbours": [
      "AT-99",
      "AT-97",
      "AT-96",
      "IT-39",
      "IT-38",
      "IT-36",
      "IT-33",
      "IT-31"
    ]
  },
  {
    "id": "IT-31",
    "neighbours": [
      "IT-36",
      "IT-35",
      "IT-33",
      "IT-32",
      "IT-30"
    ]
  },
  {
    "id": "IT-30",
    "neighbours": [
      "IT-45",
      "IT-44",
      "IT-35",
      "IT-34",
      "IT-33",
      "IT-31"
    ]
  },
  {
    "id": "IT-29",
    "neighbours": [
      "IT-43",
      "IT-27",
      "IT-26",
      "IT-20",
      "IT-16",
      "IT-15"
    ]
  },
  {
    "id": "IT-28",
    "neighbours": [
      "CH-06",
      "CH-03",
      "IT-27",
      "IT-21",
      "IT-20",
      "IT-13"
    ]
  },
  {
    "id": "IT-27",
    "neighbours": [
      "IT-29",
      "IT-28",
      "IT-26",
      "IT-20",
      "IT-15",
      "IT-13"
    ]
  },
  {
    "id": "IT-26",
    "neighbours": [
      "IT-46",
      "IT-43",
      "IT-42",
      "IT-29",
      "IT-27",
      "IT-25",
      "IT-24",
      "IT-20"
    ]
  },
  {
    "id": "IT-25",
    "neighbours": [
      "IT-46",
      "IT-38",
      "IT-37",
      "IT-29",
      "IT-26",
      "IT-24",
      "IT-23"
    ]
  },
  {
    "id": "IT-24",
    "neighbours": [
      "IT-26",
      "IT-25",
      "IT-23",
      "IT-20"
    ]
  },
  {
    "id": "IT-23",
    "neighbours": [
      "CH-07",
      "CH-06",
      "IT-39",
      "IT-38",
      "IT-25",
      "IT-24",
      "IT-22",
      "IT-20"
    ]
  },
  {
    "id": "IT-22",
    "neighbours": [
      "CH-07",
      "CH-06",
      "IT-23",
      "IT-21",
      "IT-20"
    ]
  },
  {
    "id": "IT-21",
    "neighbours": [
      "CH-06",
      "IT-28",
      "IT-22",
      "IT-20"
    ]
  },
  {
    "id": "IT-20",
    "neighbours": [
      "IT-28",
      "IT-27",
      "IT-26",
      "IT-24",
      "IT-23",
      "IT-22",
      "IT-21"
    ]
  },
  {
    "id": "IT-19",
    "neighbours": [
      "IT-54",
      "IT-43",
      "IT-16"
    ]
  },
  {
    "id": "IT-18",
    "neighbours": [
      "IT-17",
      "IT-12",
      "FR-06"
    ]
  },
  {
    "id": "IT-17",
    "neighbours": [
      "IT-18",
      "IT-16",
      "IT-15",
      "IT-14",
      "IT-12"
    ]
  },
  {
    "id": "IT-16",
    "neighbours": [
      "IT-43",
      "IT-29",
      "IT-19",
      "IT-17",
      "IT-15"
    ]
  },
  {
    "id": "IT-15",
    "neighbours": [
      "IT-29",
      "IT-27",
      "IT-17",
      "IT-16",
      "IT-14",
      "IT-13",
      "IT-12",
      "IT-10"
    ]
  },
  {
    "id": "IT-14",
    "neighbours": [
      "IT-17",
      "IT-15",
      "IT-12",
      "IT-10"
    ]
  },
  {
    "id": "IT-13",
    "neighbours": [
      "CH-03",
      "IT-28",
      "IT-27",
      "IT-15",
      "IT-14",
      "IT-11",
      "IT-10"
    ]
  },
  {
    "id": "IT-12",
    "neighbours": [
      "IT-18",
      "IT-17",
      "IT-15",
      "IT-14",
      "IT-10",
      "FR-06",
      "FR-05",
      "FR-04"
    ]
  },
  {
    "id": "IT-11",
    "neighbours": [
      "CH-03",
      "CH-01",
      "IT-28",
      "IT-13",
      "IT-10",
      "FR-74",
      "FR-73"
    ]
  },
  {
    "id": "IT-10",
    "neighbours": [
      "IT-15",
      "IT-14",
      "IT-13",
      "IT-12",
      "IT-11",
      "FR-73",
      "FR-05",
      "FR-04"
    ]
  },
  {
    "id": "IT-09",
    "neighbours": [
      "IT-08",
      "IT-07"
    ]
  },
  {
    "id": "IT-08",
    "neighbours": [
      "IT-09",
      "IT-07"
    ]
  },
  {
    "id": "IT-07",
    "neighbours": [
      "IT-09",
      "IT-08",
      "FR-20"
    ]
  },
  {
    "id": "IT-06",
    "neighbours": [
      "IT-67",
      "IT-64",
      "IT-63",
      "IT-62",
      "IT-61",
      "IT-60",
      "IT-53",
      "IT-52",
      "IT-47",
      "IT-05",
      "IT-02"
    ]
  },
  {
    "id": "IT-05",
    "neighbours": [
      "IT-53",
      "IT-06",
      "IT-02",
      "IT-01"
    ]
  },
  {
    "id": "IT-04",
    "neighbours": [
      "IT-81",
      "IT-03",
      "IT-00"
    ]
  },
  {
    "id": "IT-03",
    "neighbours": [
      "IT-86",
      "IT-81",
      "IT-67",
      "IT-04",
      "IT-00"
    ]
  },
  {
    "id": "IT-02",
    "neighbours": [
      "IT-67",
      "IT-64",
      "IT-63",
      "IT-06",
      "IT-05",
      "IT-01",
      "IT-00"
    ]
  },
  {
    "id": "IT-01",
    "neighbours": [
      "IT-58",
      "IT-53",
      "IT-05",
      "IT-02",
      "IT-00"
    ]
  },
  {
    "id": "IT-00",
    "neighbours": [
      "IT-67",
      "IT-04",
      "IT-03",
      "IT-02",
      "IT-01"
    ]
  },
  {
    "id": "IR-XX",
    "neighbours": [
      "GB-BT"
    ]
  },
  {
    "id": "IR-01",
    "neighbours": [
      "IR-XX"
    ]
  },
  {
    "id": "FR-95",
    "neighbours": [
      "FR-92-94",
      "FR-78",
      "FR-77",
      "FR-75",
      "FR-60",
      "FR-27"
    ]
  },
  {
    "id": "FR-92-94",
    "neighbours": [
      "FR-95",
      "FR-91",
      "FR-78",
      "FR-77",
      "FR-75"
    ]
  },
  {
    "id": "FR-91",
    "neighbours": [
      "FR-92-94",
      "FR-78",
      "FR-77",
      "FR-75",
      "FR-45",
      "FR-28"
    ]
  },
  {
    "id": "FR-90",
    "neighbours": [
      "CH-02",
      "FR-70",
      "FR-68",
      "FR-25"
    ]
  },
  {
    "id": "FR-89",
    "neighbours": [
      "FR-77",
      "FR-58",
      "FR-45",
      "FR-21",
      "FR-18",
      "FR-10"
    ]
  },
  {
    "id": "FR-88",
    "neighbours": [
      "FR-90",
      "FR-70",
      "FR-68",
      "FR-67",
      "FR-55",
      "FR-54",
      "FR-52"
    ]
  },
  {
    "id": "FR-87",
    "neighbours": [
      "FR-86",
      "FR-36",
      "FR-24",
      "FR-23",
      "FR-19",
      "FR-16"
    ]
  },
  {
    "id": "FR-86",
    "neighbours": [
      "FR-87",
      "FR-79",
      "FR-49",
      "FR-37",
      "FR-36",
      "FR-16"
    ]
  },
  {
    "id": "FR-85",
    "neighbours": [
      "FR-79",
      "FR-49",
      "FR-44",
      "FR-17"
    ]
  },
  {
    "id": "FR-84",
    "neighbours": [
      "FR-30",
      "FR-26",
      "FR-13",
      "FR-07",
      "FR-04"
    ]
  },
  {
    "id": "FR-83",
    "neighbours": [
      "FR-84",
      "FR-13",
      "FR-06",
      "FR-04"
    ]
  },
  {
    "id": "FR-82",
    "neighbours": [
      "FR-81",
      "FR-47",
      "FR-46",
      "FR-32",
      "FR-31",
      "FR-12"
    ]
  },
  {
    "id": "FR-81",
    "neighbours": [
      "FR-82",
      "FR-34",
      "FR-31",
      "FR-12",
      "FR-11"
    ]
  },
  {
    "id": "FR-80",
    "neighbours": [
      "FR-76",
      "FR-62",
      "FR-60",
      "FR-59",
      "FR-02"
    ]
  },
  {
    "id": "FR-79",
    "neighbours": [
      "FR-86",
      "FR-85",
      "FR-49",
      "FR-17",
      "FR-16"
    ]
  },
  {
    "id": "FR-78",
    "neighbours": [
      "FR-95",
      "FR-92-94",
      "FR-91",
      "FR-75",
      "FR-60",
      "FR-28",
      "FR-27"
    ]
  },
  {
    "id": "FR-77",
    "neighbours": [
      "FR-95",
      "FR-92-94",
      "FR-91",
      "FR-89",
      "FR-75",
      "FR-60",
      "FR-51",
      "FR-45",
      "FR-10",
      "FR-02"
    ]
  },
  {
    "id": "FR-76",
    "neighbours": [
      "FR-80",
      "FR-60",
      "FR-27",
      "FR-14"
    ]
  },
  {
    "id": "FR-75",
    "neighbours": [
      "FR-92-94"
    ]
  },
  {
    "id": "FR-74",
    "neighbours": [
      "CH-01",
      "IT-11",
      "FR-73",
      "FR-01"
    ]
  },
  {
    "id": "FR-73",
    "neighbours": [
      "IT-11",
      "IT-10",
      "FR-74",
      "FR-38",
      "FR-05",
      "FR-01"
    ]
  },
  {
    "id": "FR-72",
    "neighbours": [
      "FR-61",
      "FR-53",
      "FR-49",
      "FR-41",
      "FR-37",
      "FR-28"
    ]
  },
  {
    "id": "FR-71",
    "neighbours": [
      "FR-69",
      "FR-58",
      "FR-42",
      "FR-39",
      "FR-21",
      "FR-03",
      "FR-01"
    ]
  },
  {
    "id": "FR-70",
    "neighbours": [
      "FR-90",
      "FR-88",
      "FR-68",
      "FR-52",
      "FR-39",
      "FR-25",
      "FR-21"
    ]
  },
  {
    "id": "FR-69",
    "neighbours": [
      "FR-71",
      "FR-42",
      "FR-38",
      "FR-01"
    ]
  },
  {
    "id": "FR-68",
    "neighbours": [
      "CH-04",
      "CH-02",
      "FR-90",
      "FR-88",
      "FR-70",
      "FR-67",
      "DE-79"
    ]
  },
  {
    "id": "FR-67",
    "neighbours": [
      "FR-88",
      "FR-68",
      "FR-57",
      "DE-79",
      "DE-77",
      "DE-76",
      "DE-66"
    ]
  },
  {
    "id": "FR-66",
    "neighbours": [
      "ES-25",
      "ES-17",
      "FR-11",
      "FR-09"
    ]
  },
  {
    "id": "FR-65",
    "neighbours": [
      "ES-22",
      "FR-64",
      "FR-32",
      "FR-31"
    ]
  },
  {
    "id": "FR-64",
    "neighbours": [
      "ES-31",
      "ES-22",
      "ES-20",
      "FR-65",
      "FR-40",
      "FR-32"
    ]
  },
  {
    "id": "FR-63",
    "neighbours": [
      "FR-43",
      "FR-42",
      "FR-23",
      "FR-19",
      "FR-15",
      "FR-03"
    ]
  },
  {
    "id": "FR-62",
    "neighbours": [
      "FR-80",
      "FR-59",
      "FR-02"
    ]
  },
  {
    "id": "FR-61",
    "neighbours": [
      "FR-72",
      "FR-53",
      "FR-50",
      "FR-41",
      "FR-28",
      "FR-27",
      "FR-14"
    ]
  },
  {
    "id": "FR-60",
    "neighbours": [
      "FR-95",
      "FR-92-94",
      "FR-80",
      "FR-77",
      "FR-76",
      "FR-27",
      "FR-02"
    ]
  },
  {
    "id": "FR-59",
    "neighbours": [
      "FR-80",
      "FR-62",
      "BE-08",
      "BE-07",
      "BE-06",
      "BE-05"
    ]
  },
  {
    "id": "FR-58",
    "neighbours": [
      "FR-89",
      "FR-71",
      "FR-45",
      "FR-21",
      "FR-18",
      "FR-03"
    ]
  },
  {
    "id": "FR-57",
    "neighbours": [
      "LU-00",
      "FR-88",
      "FR-67",
      "FR-55",
      "FR-54",
      "DE-76",
      "DE-66",
      "DE-54",
      "BE-06"
    ]
  },
  {
    "id": "FR-56",
    "neighbours": [
      "FR-44",
      "FR-35",
      "FR-29",
      "FR-22"
    ]
  },
  {
    "id": "FR-55",
    "neighbours": [
      "FR-88",
      "FR-54",
      "FR-52",
      "FR-51",
      "FR-08",
      "BE-06"
    ]
  },
  {
    "id": "FR-54",
    "neighbours": [
      "LU-00",
      "FR-88",
      "FR-57",
      "FR-55",
      "BE-06"
    ]
  },
  {
    "id": "FR-53",
    "neighbours": [
      "FR-72",
      "FR-61",
      "FR-50",
      "FR-49",
      "FR-44",
      "FR-35"
    ]
  },
  {
    "id": "FR-52",
    "neighbours": [
      "FR-88",
      "FR-70",
      "FR-55",
      "FR-51",
      "FR-21",
      "FR-10"
    ]
  },
  {
    "id": "FR-51",
    "neighbours": [
      "FR-77",
      "FR-55",
      "FR-52",
      "FR-10",
      "FR-08",
      "FR-02"
    ]
  },
  {
    "id": "FR-50",
    "neighbours": [
      "FR-53",
      "FR-35",
      "FR-14"
    ]
  },
  {
    "id": "FR-49",
    "neighbours": [
      "FR-86",
      "FR-85",
      "FR-79",
      "FR-72",
      "FR-53",
      "FR-44",
      "FR-37",
      "FR-35"
    ]
  },
  {
    "id": "FR-48",
    "neighbours": [
      "FR-43",
      "FR-30",
      "FR-15",
      "FR-12",
      "FR-07"
    ]
  },
  {
    "id": "FR-47",
    "neighbours": [
      "FR-82",
      "FR-46",
      "FR-40",
      "FR-33",
      "FR-32",
      "FR-24"
    ]
  },
  {
    "id": "FR-46",
    "neighbours": [
      "FR-82",
      "FR-47",
      "FR-24",
      "FR-19",
      "FR-15",
      "FR-12"
    ]
  },
  {
    "id": "FR-45",
    "neighbours": [
      "FR-91",
      "FR-89",
      "FR-77",
      "FR-58",
      "FR-41",
      "FR-28",
      "FR-18"
    ]
  },
  {
    "id": "FR-44",
    "neighbours": [
      "FR-85",
      "FR-56",
      "FR-53",
      "FR-49",
      "FR-35"
    ]
  },
  {
    "id": "FR-43",
    "neighbours": [
      "FR-63",
      "FR-48",
      "FR-42",
      "FR-15",
      "FR-07"
    ]
  },
  {
    "id": "FR-42",
    "neighbours": [
      "FR-71",
      "FR-69",
      "FR-63",
      "FR-43",
      "FR-38",
      "FR-26",
      "FR-07",
      "FR-03"
    ]
  },
  {
    "id": "FR-41",
    "neighbours": [
      "FR-72",
      "FR-61",
      "FR-45",
      "FR-37",
      "FR-36",
      "FR-28",
      "FR-18"
    ]
  },
  {
    "id": "FR-40",
    "neighbours": [
      "FR-65",
      "FR-64",
      "FR-47",
      "FR-33",
      "FR-32"
    ]
  },
  {
    "id": "FR-39",
    "neighbours": [
      "CH-01",
      "FR-74",
      "FR-71",
      "FR-70",
      "FR-25",
      "FR-21",
      "FR-01"
    ]
  },
  {
    "id": "FR-38",
    "neighbours": [
      "FR-73",
      "FR-69",
      "FR-42",
      "FR-26",
      "FR-07",
      "FR-05",
      "FR-01"
    ]
  },
  {
    "id": "FR-37",
    "neighbours": [
      "FR-86",
      "FR-72",
      "FR-49",
      "FR-41",
      "FR-36"
    ]
  },
  {
    "id": "FR-36",
    "neighbours": [
      "FR-87",
      "FR-86",
      "FR-41",
      "FR-37",
      "FR-23",
      "FR-18",
      "FR-03"
    ]
  },
  {
    "id": "FR-35",
    "neighbours": [
      "FR-56",
      "FR-53",
      "FR-50",
      "FR-49",
      "FR-44",
      "FR-22"
    ]
  },
  {
    "id": "FR-34",
    "neighbours": [
      "FR-81",
      "FR-30",
      "FR-13",
      "FR-12",
      "FR-11"
    ]
  },
  {
    "id": "FR-33",
    "neighbours": [
      "FR-47",
      "FR-40",
      "FR-24",
      "FR-17",
      "FR-16"
    ]
  },
  {
    "id": "FR-32",
    "neighbours": [
      "FR-82",
      "FR-65",
      "FR-64",
      "FR-47",
      "FR-40",
      "FR-31"
    ]
  },
  {
    "id": "FR-31",
    "neighbours": [
      "ES-25",
      "ES-22",
      "FR-82",
      "FR-81",
      "FR-65",
      "FR-32",
      "FR-11",
      "FR-09"
    ]
  },
  {
    "id": "FR-30",
    "neighbours": [
      "FR-84",
      "FR-48",
      "FR-34",
      "FR-26",
      "FR-13",
      "FR-12",
      "FR-07"
    ]
  },
  {
    "id": "FR-29",
    "neighbours": [
      "FR-56",
      "FR-22"
    ]
  },
  {
    "id": "FR-28",
    "neighbours": [
      "FR-91",
      "FR-78",
      "FR-72",
      "FR-61",
      "FR-45",
      "FR-41",
      "FR-27"
    ]
  },
  {
    "id": "FR-27",
    "neighbours": [
      "FR-95",
      "FR-78",
      "FR-76",
      "FR-61",
      "FR-60",
      "FR-28",
      "FR-14"
    ]
  },
  {
    "id": "FR-26",
    "neighbours": [
      "FR-84",
      "FR-69",
      "FR-42",
      "FR-38",
      "FR-30",
      "FR-07",
      "FR-05",
      "FR-04"
    ]
  },
  {
    "id": "FR-25",
    "neighbours": [
      "CH-02",
      "CH-01",
      "FR-90",
      "FR-70",
      "FR-68",
      "FR-39"
    ]
  },
  {
    "id": "FR-24",
    "neighbours": [
      "FR-87",
      "FR-47",
      "FR-46",
      "FR-33",
      "FR-19",
      "FR-17",
      "FR-16"
    ]
  },
  {
    "id": "FR-23",
    "neighbours": [
      "FR-87",
      "FR-63",
      "FR-36",
      "FR-19",
      "FR-18",
      "FR-03"
    ]
  },
  {
    "id": "FR-22",
    "neighbours": [
      "FR-56",
      "FR-35",
      "FR-29"
    ]
  },
  {
    "id": "FR-21",
    "neighbours": [
      "FR-89",
      "FR-71",
      "FR-70",
      "FR-58",
      "FR-52",
      "FR-39",
      "FR-10"
    ]
  },
  {
    "id": "FR-20",
    "neighbours": [
      "IT-07"
    ]
  },
  {
    "id": "FR-19",
    "neighbours": [
      "FR-87",
      "FR-63",
      "FR-46",
      "FR-24",
      "FR-23",
      "FR-15"
    ]
  },
  {
    "id": "FR-18",
    "neighbours": [
      "FR-89",
      "FR-58",
      "FR-45",
      "FR-41",
      "FR-36",
      "FR-23",
      "FR-03"
    ]
  },
  {
    "id": "FR-17",
    "neighbours": [
      "FR-85",
      "FR-79",
      "FR-33",
      "FR-16"
    ]
  },
  {
    "id": "FR-16",
    "neighbours": [
      "FR-87",
      "FR-86",
      "FR-79",
      "FR-33",
      "FR-24",
      "FR-17"
    ]
  },
  {
    "id": "FR-15",
    "neighbours": [
      "FR-63",
      "FR-48",
      "FR-46",
      "FR-43",
      "FR-19",
      "FR-12"
    ]
  },
  {
    "id": "FR-14",
    "neighbours": [
      "FR-76",
      "FR-61",
      "FR-50",
      "FR-27"
    ]
  },
  {
    "id": "FR-13",
    "neighbours": [
      "FR-84",
      "FR-83",
      "FR-34",
      "FR-30",
      "FR-04"
    ]
  },
  {
    "id": "FR-12",
    "neighbours": [
      "FR-82",
      "FR-81",
      "FR-48",
      "FR-46",
      "FR-34",
      "FR-30",
      "FR-15"
    ]
  },
  {
    "id": "FR-11",
    "neighbours": [
      "FR-81",
      "FR-66",
      "FR-34",
      "FR-31",
      "FR-09"
    ]
  },
  {
    "id": "FR-10",
    "neighbours": [
      "FR-89",
      "FR-77",
      "FR-52",
      "FR-51",
      "FR-21"
    ]
  },
  {
    "id": "FR-09",
    "neighbours": [
      "ES-25",
      "FR-66",
      "FR-31",
      "FR-11"
    ]
  },
  {
    "id": "FR-08",
    "neighbours": [
      "FR-55",
      "FR-51",
      "FR-02",
      "BE-06",
      "BE-05"
    ]
  },
  {
    "id": "FR-07",
    "neighbours": [
      "FR-84",
      "FR-69",
      "FR-48",
      "FR-43",
      "FR-42",
      "FR-38",
      "FR-30",
      "FR-26"
    ]
  },
  {
    "id": "FR-06",
    "neighbours": [
      "IT-18",
      "IT-12",
      "FR-83",
      "FR-04"
    ]
  },
  {
    "id": "FR-05",
    "neighbours": [
      "IT-12",
      "IT-10",
      "FR-84",
      "FR-73",
      "FR-38",
      "FR-26",
      "FR-04"
    ]
  },
  {
    "id": "FR-04",
    "neighbours": [
      "IT-12",
      "IT-10",
      "FR-84",
      "FR-83",
      "FR-26",
      "FR-13",
      "FR-06",
      "FR-05"
    ]
  },
  {
    "id": "FR-03",
    "neighbours": [
      "FR-71",
      "FR-63",
      "FR-58",
      "FR-42",
      "FR-36",
      "FR-23",
      "FR-18"
    ]
  },
  {
    "id": "FR-02",
    "neighbours": [
      "FR-80",
      "FR-77",
      "FR-62",
      "FR-60",
      "FR-59",
      "FR-51",
      "FR-08",
      "BE-06",
      "BE-05"
    ]
  },
  {
    "id": "FR-01",
    "neighbours": [
      "CH-01",
      "FR-74",
      "FR-73",
      "FR-71",
      "FR-69",
      "FR-39",
      "FR-38"
    ]
  },
  {
    "id": "FI-94",
    "neighbours": [
      "FI-95"
    ]
  },
  {
    "id": "FI-96",
    "neighbours": [
      "FI-97"
    ]
  },
  {
    "id": "FI-98",
    "neighbours": [
      "FI-96",
      "FI-99",
      "FI-93",
      "FI-97"
    ]
  },
  {
    "id": "FI-99",
    "neighbours": [
      "SE-98",
      "NO-09",
      "FI-98",
      "FI-95",
      "FI-97"
    ]
  },
  {
    "id": "FI-95",
    "neighbours": [
      "SE-98",
      "SE-95",
      "FI-94",
      "FI-99",
      "FI-93",
      "FI-97",
      "FI-91",
      "FI-90"
    ]
  },
  {
    "id": "FI-92",
    "neighbours": [
      "FI-91",
      "FI-90",
      "FI-88",
      "FI-86",
      "FI-74"
    ]
  },
  {
    "id": "FI-93",
    "neighbours": [
      "FI-98",
      "FI-95",
      "FI-97",
      "FI-91",
      "FI-90",
      "FI-89"
    ]
  },
  {
    "id": "FI-97",
    "neighbours": [
      "SE-98",
      "FI-96",
      "FI-98",
      "FI-99",
      "FI-95",
      "FI-93",
      "FI-91"
    ]
  },
  {
    "id": "FI-91",
    "neighbours": [
      "FI-95",
      "FI-92",
      "FI-93",
      "FI-90",
      "FI-89",
      "FI-87"
    ]
  },
  {
    "id": "FI-90",
    "neighbours": [
      "FI-91"
    ]
  },
  {
    "id": "FI-89",
    "neighbours": [
      "FI-93",
      "FI-91",
      "FI-88"
    ]
  },
  {
    "id": "FI-88",
    "neighbours": [
      "FI-92",
      "FI-91",
      "FI-89",
      "FI-87",
      "FI-81",
      "FI-75",
      "FI-74"
    ]
  },
  {
    "id": "FI-87",
    "neighbours": [
      "FI-88",
      "FI-74"
    ]
  },
  {
    "id": "FI-86",
    "neighbours": [
      "FI-92",
      "FI-85",
      "FI-84",
      "FI-74",
      "FI-72",
      "FI-44"
    ]
  },
  {
    "id": "FI-85",
    "neighbours": [
      "FI-86",
      "FI-84",
      "FI-69",
      "FI-68",
      "FI-44",
      "FI-43"
    ]
  },
  {
    "id": "FI-84",
    "neighbours": [
      "FI-86",
      "FI-85"
    ]
  },
  {
    "id": "FI-83",
    "neighbours": [
      "FI-82",
      "FI-81",
      "FI-80",
      "FI-79",
      "FI-75",
      "FI-73",
      "FI-71",
      "FI-53"
    ]
  },
  {
    "id": "FI-82",
    "neighbours": [
      "FI-83",
      "FI-81",
      "FI-80",
      "FI-79",
      "FI-59",
      "FI-53"
    ]
  },
  {
    "id": "FI-81",
    "neighbours": [
      "FI-88",
      "FI-83",
      "FI-82",
      "FI-80",
      "FI-75"
    ]
  },
  {
    "id": "FI-80",
    "neighbours": [
      "FI-83",
      "FI-82",
      "FI-81"
    ]
  },
  {
    "id": "FI-79",
    "neighbours": [
      "FI-83",
      "FI-78",
      "FI-77",
      "FI-71",
      "FI-70",
      "FI-58",
      "FL-53",
      "FI-51"
    ]
  },
  {
    "id": "FI-78",
    "neighbours": [
      "FI-79",
      "FI-77"
    ]
  },
  {
    "id": "FI-77",
    "neighbours": [
      "FI-79",
      "FI-78",
      "FI-76",
      "FI-72",
      "FI-71",
      "FI-70",
      "FI-51",
      "FI-44",
      "FI-41"
    ]
  },
  {
    "id": "FI-76",
    "neighbours": [
      "FI-77",
      "FI-51"
    ]
  },
  {
    "id": "FI-75",
    "neighbours": [
      "FI-88",
      "FI-83",
      "FI-81",
      "FI-74",
      "FI-73"
    ]
  },
  {
    "id": "FI-74",
    "neighbours": [
      "FI-92",
      "FI-88",
      "FI-87",
      "FI-86",
      "FI-75",
      "FI-73",
      "FI-72",
      "FI-71",
      "FI-44"
    ]
  },
  {
    "id": "FI-73",
    "neighbours": [
      "FI-83",
      "FI-75",
      "FI-74",
      "FI-72",
      "FI-71",
      "FI-70"
    ]
  },
  {
    "id": "FI-72",
    "neighbours": [
      "FI-86",
      "FI-79",
      "FI-77",
      "FI-74",
      "FI-71",
      "FI-70",
      "FI-44"
    ]
  },
  {
    "id": "FI-71",
    "neighbours": [
      "FI-83",
      "FI-79",
      "FI-77",
      "FI-74",
      "FI-73",
      "FI-72",
      "FI-70"
    ]
  },
  {
    "id": "FI-70",
    "neighbours": [
      "FI-73",
      "FI-71"
    ]
  },
  {
    "id": "FI-69",
    "neighbours": [
      "FI-85",
      "FI-68",
      "FI-63",
      "FI-62",
      "FI-43"
    ]
  },
  {
    "id": "FI-68",
    "neighbours": [
      "FI-85",
      "FI-69",
      "FI-62"
    ]
  },
  {
    "id": "FI-66",
    "neighbours": [
      "FI-64",
      "FI-62",
      "FI-61",
      "FI-60"
    ]
  },
  {
    "id": "FI-64",
    "neighbours": [
      "FI-66",
      "FI-61",
      "FI-38",
      "FI-29"
    ]
  },
  {
    "id": "FI-63",
    "neighbours": [
      "FI-62",
      "FI-61",
      "FI-60",
      "FI-43",
      "FI-42",
      "FI-39",
      "FI-34"
    ]
  },
  {
    "id": "FI-62",
    "neighbours": [
      "FI-69",
      "FI-68",
      "FI-66",
      "FI-63",
      "FI-61",
      "FI-60",
      "FI-43"
    ]
  },
  {
    "id": "FI-61",
    "neighbours": [
      "FI-66",
      "FI-64",
      "FI-63",
      "FI-62",
      "FI-60",
      "FI-39",
      "FI-38",
      "FI-34"
    ]
  },
  {
    "id": "FI-60",
    "neighbours": [
      "FI-62",
      "FI-61"
    ]
  },
  {
    "id": "FI-59",
    "neighbours": [
      "FI-82",
      "FI-56",
      "FL-53"
    ]
  },
  {
    "id": "FI-58",
    "neighbours": [
      "FI-59",
      "FL-53"
    ]
  },
  {
    "id": "FI-56",
    "neighbours": [
      "FI-59",
      "FI-55",
      "FI-54",
      "FL-53",
      "FI-52"
    ]
  },
  {
    "id": "FI-55",
    "neighbours": [
      "FI-56",
      "FI-54"
    ]
  },
  {
    "id": "FL-54",
    "neighbours": [
      "FI-54"
    ]
  },
  {
    "id": "FI-54",
    "neighbours": [
      "FI-56",
      "FI-55",
      "FL-54",
      "FI-52",
      "FI-49",
      "FI-46"
    ]
  },
  {
    "id": "FL-53",
    "neighbours": [
      "FI-83",
      "FI-82",
      "FI-79",
      "FI-78",
      "FI-77",
      "FI-59",
      "FI-58",
      "FI-56",
      "FI-52",
      "FI-51"
    ]
  },
  {
    "id": "FI-52",
    "neighbours": [
      "FI-56",
      "FI-54",
      "FL-53",
      "FI-51",
      "FI-50",
      "FI-47",
      "FI-46",
      "FI-41",
      "FI-19",
      "FI-18"
    ]
  },
  {
    "id": "FI-51",
    "neighbours": [
      "FI-79",
      "FI-77",
      "FI-76",
      "FL-53",
      "FI-52",
      "FI-50",
      "FI-41",
      "FI-40",
      "FI-19"
    ]
  },
  {
    "id": "FI-50",
    "neighbours": [
      "FI-52",
      "FI-51"
    ]
  },
  {
    "id": "FI-49",
    "neighbours": [
      "FI-54",
      "FI-46",
      "FI-07"
    ]
  },
  {
    "id": "FI-47",
    "neighbours": [
      "FI-52",
      "FI-49",
      "FI-46",
      "FI-45",
      "FI-19",
      "FI-18",
      "FI-16",
      "FI-07"
    ]
  },
  {
    "id": "FI-46",
    "neighbours": [
      "FI-54",
      "FI-52",
      "FI-49",
      "FI-47",
      "FI-45"
    ]
  },
  {
    "id": "FI-45",
    "neighbours": [
      "FI-47",
      "FI-46"
    ]
  },
  {
    "id": "FI-44",
    "neighbours": [
      "FI-86",
      "FI-85",
      "FI-77",
      "FI-76",
      "FI-74",
      "FI-72",
      "FI-69",
      "FI-43",
      "FI-41",
      "FI-40"
    ]
  },
  {
    "id": "FI-43",
    "neighbours": [
      "FI-85",
      "FI-69",
      "FI-63",
      "FI-62",
      "FI-44",
      "FI-42",
      "FI-41"
    ]
  },
  {
    "id": "FI-42",
    "neighbours": [
      "FI-63",
      "FI-43",
      "FI-41",
      "FI-35",
      "FI-34",
      "FI-19",
      "FI-17"
    ]
  },
  {
    "id": "FI-41",
    "neighbours": [
      "FI-77",
      "FI-76",
      "FI-51",
      "FI-44",
      "FI-43",
      "FI-42",
      "FI-40",
      "FI-19"
    ]
  },
  {
    "id": "FI-40",
    "neighbours": [
      "FI-41"
    ]
  },
  {
    "id": "FI-39",
    "neighbours": [
      "FI-63",
      "FI-61",
      "FI-38",
      "FI-37",
      "FI-34",
      "FI-33"
    ]
  },
  {
    "id": "FI-38",
    "neighbours": [
      "FI-64",
      "FI-61",
      "FI-39",
      "FI-37",
      "FI-32",
      "FI-31",
      "FI-29"
    ]
  },
  {
    "id": "FI-37",
    "neighbours": [
      "FI-39",
      "FI-38",
      "FI-36",
      "FI-33",
      "FI-31",
      "FI-14",
      "FI-13"
    ]
  },
  {
    "id": "FI-36",
    "neighbours": [
      "FI-37",
      "FI-35",
      "FI-34",
      "FI-33",
      "FI-17",
      "FI-14",
      "FI-13"
    ]
  },
  {
    "id": "FI-35",
    "neighbours": [
      "FI-42",
      "FI-36",
      "FI-34",
      "FI-33",
      "FI-17"
    ]
  },
  {
    "id": "FI-34",
    "neighbours": [
      "FI-63",
      "FI-61",
      "FI-42",
      "FI-39",
      "FI-37",
      "FI-36",
      "FI-35",
      "FI-33"
    ]
  },
  {
    "id": "FI-33",
    "neighbours": [
      "FI-39",
      "FI-37",
      "FI-36",
      "FI-35",
      "FI-34"
    ]
  },
  {
    "id": "FI-32",
    "neighbours": [
      "FI-38",
      "FI-31",
      "FI-29",
      "FI-27",
      "FI-25",
      "FI-21"
    ]
  },
  {
    "id": "FI-31",
    "neighbours": [
      "FI-38",
      "FI-37",
      "FI-32",
      "FI-25",
      "FI-21",
      "FI-14",
      "FI-12",
      "FI-09",
      "FI-03"
    ]
  },
  {
    "id": "FI-29",
    "neighbours": [
      "FI-64",
      "FI-38",
      "FI-32",
      "FI-27"
    ]
  },
  {
    "id": "FI-27",
    "neighbours": [
      "FI-32",
      "FI-29",
      "FI-23"
    ]
  },
  {
    "id": "FI-25",
    "neighbours": [
      "FI-31",
      "FI-10",
      "FI-09",
      "FI-03"
    ]
  },
  {
    "id": "FI-23",
    "neighbours": [
      "FI-27",
      "FI-21"
    ]
  },
  {
    "id": "FI-22",
    "neighbours": []
  },
  {
    "id": "FI-21",
    "neighbours": [
      "FI-32",
      "FI-27",
      "FI-23"
    ]
  },
  {
    "id": "FI-19",
    "neighbours": [
      "FI-52",
      "FI-51",
      "FI-47",
      "FI-42",
      "FI-41",
      "FI-18",
      "FI-17",
      "FI-16",
      "FI-15"
    ]
  },
  {
    "id": "FI-18",
    "neighbours": [
      "FI-52",
      "FI-47",
      "FI-19",
      "FI-17",
      "FI-15"
    ]
  },
  {
    "id": "FI-17",
    "neighbours": [
      "FI-42",
      "FI-36",
      "FI-35",
      "FI-19",
      "FI-18",
      "FI-16",
      "FI-15",
      "FI-14"
    ]
  },
  {
    "id": "FI-16",
    "neighbours": [
      "FI-47",
      "FI-45",
      "FI-36",
      "FI-17",
      "FI-15",
      "FI-14",
      "FI-13",
      "FI-12",
      "FI-07",
      "FI-04"
    ]
  },
  {
    "id": "FI-15",
    "neighbours": [
      "FI-47",
      "FI-19",
      "FI-18",
      "FI-17",
      "FI-16"
    ]
  },
  {
    "id": "FI-14",
    "neighbours": [
      "FI-37",
      "FI-36",
      "FI-31",
      "FI-17",
      "FI-16",
      "FI-13",
      "FI-12"
    ]
  },
  {
    "id": "FI-13",
    "neighbours": [
      "FI-37",
      "FI-36",
      "FI-16",
      "FI-14"
    ]
  },
  {
    "id": "FI-12",
    "neighbours": [
      "FI-31",
      "FI-16",
      "FI-14",
      "FI-05",
      "FI-04",
      "FI-03"
    ]
  },
  {
    "id": "FI-10",
    "neighbours": [
      "FI-25",
      "FI-09",
      "FI-08",
      "FI-02"
    ]
  },
  {
    "id": "FI-09",
    "neighbours": [
      "FI-31",
      "FI-25",
      "FI-08",
      "FI-03"
    ]
  },
  {
    "id": "FI-08",
    "neighbours": [
      "FI-10",
      "FI-09",
      "FI-03",
      "FI-02"
    ]
  },
  {
    "id": "FI-07",
    "neighbours": [
      "FI-47",
      "FI-16",
      "FI-04"
    ]
  },
  {
    "id": "FI-05",
    "neighbours": [
      "FI-12",
      "FI-04",
      "FI-03",
      "FI-01"
    ]
  },
  {
    "id": "FI-04",
    "neighbours": [
      "FI-16",
      "FI-12",
      "FI-07",
      "FI-05",
      "FI-01"
    ]
  },
  {
    "id": "FI-03",
    "neighbours": [
      "FI-31",
      "FI-12",
      "FI-09",
      "FI-08",
      "FI-05",
      "FI-02",
      "FI-01"
    ]
  },
  {
    "id": "FI-02",
    "neighbours": [
      "FI-08",
      "FI-03",
      "FI-01"
    ]
  },
  {
    "id": "FI-01",
    "neighbours": [
      "FI-05",
      "FI-04",
      "FI-03",
      "FI-02"
    ]
  },
  {
    "id": "HU-09",
    "neighbours": [
      "SK-94",
      "SK-93",
      "SK-92",
      "SK-90",
      "SK-81-85",
      "SI-09",
      "AT-84",
      "AT-75",
      "AT-74",
      "AT-73",
      "AT-72",
      "AT-71",
      "AT-70",
      "AT-24",
      "HU-08",
      "HU-02"
    ]
  },
  {
    "id": "HU-08",
    "neighbours": [
      "SI-09",
      "SI-02",
      "AT-84",
      "HR-04",
      "HU-09",
      "HU-07",
      "HU-06",
      "HU-02",
      "HU-01"
    ]
  },
  {
    "id": "HU-07",
    "neighbours": [
      "RS-25",
      "HR-04",
      "HR-03",
      "HU-08",
      "HU-06",
      "HU-02"
    ]
  },
  {
    "id": "HU-06",
    "neighbours": [
      "RS-25",
      "RS-24",
      "RS-23",
      "RO-31",
      "RO-30",
      "HR-03",
      "HU-08",
      "HU-07",
      "HU-05",
      "HU-02",
      "HU-01"
    ]
  },
  {
    "id": "HU-05",
    "neighbours": [
      "RO-41",
      "RO-31",
      "RO-30",
      "HU-06",
      "HU-04",
      "HU-03",
      "HU-02"
    ]
  },
  {
    "id": "HU-04",
    "neighbours": [
      "SK-07",
      "RO-44",
      "RO-41",
      "UA-88",
      "HU-05",
      "HU-03"
    ]
  },
  {
    "id": "HU-03",
    "neighbours": [
      "SK-99",
      "SK-98",
      "SK-97",
      "SK-05",
      "SK-07",
      "SK-04",
      "UA-88",
      "HU-05",
      "HU-04",
      "HU-02"
    ]
  },
  {
    "id": "HU-02",
    "neighbours": [
      "SK-99",
      "SK-98",
      "SK-96",
      "SK-94",
      "SK-93",
      "HU-09",
      "HU-08",
      "HU-07",
      "HU-06",
      "HU-05",
      "HU-03",
      "HU-01"
    ]
  },
  {
    "id": "HU-01",
    "neighbours": [
      "HU-02"
    ]
  },
  {
    "id": "EE-09",
    "neighbours": [
      "EE-08",
      "EE-01"
    ]
  },
  {
    "id": "EE-08",
    "neighbours": [
      "LV-42",
      "LV-40",
      "EE-09",
      "EE-07"
    ]
  },
  {
    "id": "EE-07",
    "neighbours": [
      "LV-47",
      "LV-42",
      "EE-09",
      "EE-08",
      "EE-06",
      "EE-05",
      "EE-04",
      "EE-01"
    ]
  },
  {
    "id": "EE-06",
    "neighbours": [
      "LV-47",
      "LV-44",
      "LV-43",
      "LV-42",
      "EE-07",
      "EE-05"
    ]
  },
  {
    "id": "EE-05",
    "neighbours": [
      "EE-07",
      "EE-06",
      "EE-04",
      "EE-02"
    ]
  },
  {
    "id": "EE-04",
    "neighbours": [
      "EE-07",
      "EE-05",
      "EE-02"
    ]
  },
  {
    "id": "EE-02",
    "neighbours": [
      "EE-04"
    ]
  },
  {
    "id": "EE-01",
    "neighbours": [
      "EE-09",
      "EE-07"
    ]
  },
  {
    "id": "GB-ZE",
    "neighbours": []
  },
  {
    "id": "GB-YO",
    "neighbours": [
      "GB-WF",
      "GB-TS",
      "GB-LS",
      "GB-HU",
      "GB-HG",
      "GB-DN",
      "GB-DL"
    ]
  },
  {
    "id": "GB-WV",
    "neighbours": [
      "GB-WS",
      "GB-TF",
      "GB-SY",
      "GB-ST",
      "GB-DY"
    ]
  },
  {
    "id": "GB-WS",
    "neighbours": [
      "GB-WV",
      "GB-ST",
      "GB-DY",
      "GB-DE",
      "GB-B"
    ]
  },
  {
    "id": "GB-WR",
    "neighbours": [
      "GB-SY",
      "GB-HR",
      "GB-GL",
      "GB-DY",
      "GB-CV",
      "GB-B"
    ]
  },
  {
    "id": "GB-WN",
    "neighbours": [
      "GB-WA",
      "GB-PR",
      "GB-M",
      "GB-L",
      "GB-BL"
    ]
  },
  {
    "id": "GB-WF",
    "neighbours": [
      "GB-S",
      "GB-LS",
      "GB-HX",
      "GB-HD",
      "GB-DN",
      "GB-BD"
    ]
  },
  {
    "id": "GB-WA",
    "neighbours": [
      "GB-WN",
      "GB-SK",
      "GB-M",
      "GB-L",
      "GB-CW",
      "GB-CH",
      "GB-BL"
    ]
  },
  {
    "id": "GB-TS",
    "neighbours": [
      "GB-YO",
      "GB-SR",
      "GB-DL",
      "GB-DH"
    ]
  },
  {
    "id": "GB-TR",
    "neighbours": [
      "GB-PL"
    ]
  },
  {
    "id": "GB-TQ",
    "neighbours": [
      "GB-PL",
      "GB-EX"
    ]
  },
  {
    "id": "GB-TN",
    "neighbours": [
      "GB-RH",
      "GB-ME",
      "GB-CT",
      "GB-BN",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-TF",
    "neighbours": [
      "GB-WV",
      "GB-SY",
      "GB-ST",
      "GB-CW"
    ]
  },
  {
    "id": "GB-TD",
    "neighbours": [
      "GB-NE",
      "GB-ML",
      "GB-EH",
      "GB-DG",
      "GB-CA"
    ]
  },
  {
    "id": "GB-TA",
    "neighbours": [
      "GB-EX",
      "GB-DT",
      "GB-BS",
      "GB-BA"
    ]
  },
  {
    "id": "GB-SY",
    "neighbours": [
      "GB-WV",
      "GB-WR",
      "GB-WA",
      "GB-TF",
      "GB-SA",
      "GB-LL",
      "GB-LD",
      "GB-HR",
      "GB-DY",
      "GB-CW",
      "GB-CH"
    ]
  },
  {
    "id": "GB-ST",
    "neighbours": [
      "GB-WV",
      "GB-WS",
      "GB-TF",
      "GB-SK",
      "GB-DE",
      "GB-CW"
    ]
  },
  {
    "id": "GB-SS",
    "neighbours": [
      "GB-ME",
      "GB-CM",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-SR",
    "neighbours": [
      "GB-NE",
      "GB-DH"
    ]
  },
  {
    "id": "GB-SP",
    "neighbours": [
      "GB-SO",
      "GB-SN",
      "GB-RG",
      "GB-DT",
      "GB-BH",
      "GB-BA"
    ]
  },
  {
    "id": "GB-SO",
    "neighbours": [
      "GB-SP",
      "GB-RG",
      "GB-PO",
      "GB-GU",
      "GB-BH"
    ]
  },
  {
    "id": "GB-SN",
    "neighbours": [
      "GB-SP",
      "GB-RG",
      "GB-OX",
      "GB-GL",
      "GB-BS",
      "GB-BA"
    ]
  },
  {
    "id": "GB-SL",
    "neighbours": [
      "GB-RG",
      "GB-KT",
      "GB-HP",
      "GB-GU",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-SK",
    "neighbours": [
      "GB-WA",
      "GB-ST",
      "GB-S",
      "GB-OL",
      "GB-M",
      "GB-HD",
      "GB-DE",
      "GB-CW"
    ]
  },
  {
    "id": "GB-SG",
    "neighbours": [
      "GB-PE",
      "GB-MK",
      "GB-LU",
      "GB-CM",
      "GB-CB",
      "GB-AL",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-SA",
    "neighbours": [
      "GB-SY",
      "GB-NP",
      "GB-LD",
      "GB-CF"
    ]
  },
  {
    "id": "GB-S",
    "neighbours": [
      "GB-WF",
      "GB-SK",
      "GB-OL",
      "GB-NG",
      "GB-HD",
      "GB-DN",
      "GB-DE"
    ]
  },
  {
    "id": "GB-RH",
    "neighbours": [
      "GB-TN",
      "GB-PO",
      "GB-KT",
      "GB-GU",
      "GB-BN",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-RG",
    "neighbours": [
      "GB-SP",
      "GB-SO",
      "GB-SN",
      "GB-SL",
      "GB-OX",
      "GB-KT",
      "GB-HP",
      "GB-GU",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-PR",
    "neighbours": [
      "GB-WN",
      "GB-LA",
      "GB-L",
      "GB-FY",
      "GB-BL",
      "GB-BB"
    ]
  },
  {
    "id": "GB-PO",
    "neighbours": [
      "GB-SO",
      "GB-RH",
      "GB-GU",
      "GB-BN"
    ]
  },
  {
    "id": "GB-PL",
    "neighbours": [
      "GB-TR",
      "GB-TQ",
      "GB-EX"
    ]
  },
  {
    "id": "GB-PH",
    "neighbours": [
      "GB-PA",
      "GB-KY",
      "GB-IV",
      "GB-FK",
      "GB-EH",
      "GB-DD",
      "GB-AB"
    ]
  },
  {
    "id": "GB-PE",
    "neighbours": [
      "GB-SG",
      "GB-NR",
      "GB-NN",
      "GB-NG",
      "GB-MK",
      "GB-LN",
      "GB-LE",
      "GB-IP",
      "GB-CB"
    ]
  },
  {
    "id": "GB-PA",
    "neighbours": [
      "GB-PH",
      "GB-KA",
      "GB-G",
      "GB-FK"
    ]
  },
  {
    "id": "GB-OX",
    "neighbours": [
      "GB-SN",
      "GB-SL",
      "GB-RG",
      "GB-NN",
      "GB-MK",
      "GB-HP",
      "GB-GL",
      "GB-CV"
    ]
  },
  {
    "id": "GB-OL",
    "neighbours": [
      "GB-SK",
      "GB-M",
      "GB-HX",
      "GB-HD",
      "GB-BL",
      "GB-BB"
    ]
  },
  {
    "id": "GB-NR",
    "neighbours": [
      "GB-PE",
      "GB-IP"
    ]
  },
  {
    "id": "GB-NP",
    "neighbours": [
      "GB-LD",
      "GB-HR",
      "GB-GL",
      "GB-CF",
      "GB-BS"
    ]
  },
  {
    "id": "GB-NN",
    "neighbours": [
      "GB-PE",
      "GB-OX",
      "GB-MK",
      "GB-LE",
      "GB-CV"
    ]
  },
  {
    "id": "GB-NG",
    "neighbours": [
      "GB-S",
      "GB-PE",
      "GB-LN",
      "GB-LE",
      "GB-DN",
      "GB-DE"
    ]
  },
  {
    "id": "GB-NE",
    "neighbours": [
      "GB-TD",
      "GB-SR",
      "GB-DL",
      "GB-DH",
      "GB-CA"
    ]
  },
  {
    "id": "GB-ML",
    "neighbours": [
      "GB-TD",
      "GB-KA",
      "GB-G",
      "GB-FK",
      "GB-EH",
      "GB-DG"
    ]
  },
  {
    "id": "GB-MK",
    "neighbours": [
      "GB-SG",
      "GB-PE",
      "GB-OX",
      "GB-NN",
      "GB-LU",
      "GB-HP"
    ]
  },
  {
    "id": "GB-ME",
    "neighbours": [
      "GB-TN",
      "GB-SS",
      "GB-CT",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-M",
    "neighbours": [
      "GB-WN",
      "GB-WA",
      "GB-SK",
      "GB-OL",
      "GB-BL"
    ]
  },
  {
    "id": "GB-LU",
    "neighbours": [
      "GB-SG",
      "GB-MK",
      "GB-HP",
      "GB-AL"
    ]
  },
  {
    "id": "GB-LS",
    "neighbours": [
      "GB-YO",
      "GB-WF",
      "GB-HG",
      "GB-DN",
      "GB-BD"
    ]
  },
  {
    "id": "GB-LN",
    "neighbours": [
      "GB-PE",
      "GB-NG",
      "GB-DN"
    ]
  },
  {
    "id": "GB-LL",
    "neighbours": [
      "GB-SY",
      "GB-CW",
      "GB-CH"
    ]
  },
  {
    "id": "GB-LE",
    "neighbours": [
      "GB-PE",
      "GB-NN",
      "GB-NG",
      "GB-DE",
      "GB-CV",
      "GB-B"
    ]
  },
  {
    "id": "GB-LD",
    "neighbours": [
      "GB-SY",
      "GB-SA",
      "GB-NP",
      "GB-HR",
      "GB-CF"
    ]
  },
  {
    "id": "GB-LA",
    "neighbours": [
      "GB-PR",
      "GB-DL",
      "GB-CA",
      "GB-BD",
      "GB-BB"
    ]
  },
  {
    "id": "GB-L",
    "neighbours": [
      "GB-WN",
      "GB-WA",
      "GB-PR",
      "GB-CH"
    ]
  },
  {
    "id": "GB-KY",
    "neighbours": [
      "GB-FK",
      "GB-EH"
    ]
  },
  {
    "id": "GB-KW",
    "neighbours": [
      "GB-IV"
    ]
  },
  {
    "id": "GB-KT",
    "neighbours": [
      "GB-SL",
      "GB-RH",
      "GB-GU",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-KA",
    "neighbours": [
      "GB-PA",
      "GB-ML",
      "GB-G",
      "GB-DG"
    ]
  },
  {
    "id": "GB-JE",
    "neighbours": []
  },
  {
    "id": "GB-IV",
    "neighbours": [
      "GB-PH",
      "GB-KW",
      "GB-AB"
    ]
  },
  {
    "id": "GB-IP",
    "neighbours": [
      "GB-PE",
      "GB-NR",
      "GB-CO",
      "GB-CB"
    ]
  },
  {
    "id": "GB-IM",
    "neighbours": []
  },
  {
    "id": "GB-IG",
    "neighbours": [
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-HX",
    "neighbours": [
      "GB-OL",
      "GB-HD",
      "GB-BD",
      "GB-BB"
    ]
  },
  {
    "id": "GB-HU",
    "neighbours": [
      "GB-YO",
      "GB-DN"
    ]
  },
  {
    "id": "GB-HS",
    "neighbours": []
  },
  {
    "id": "GB-HR",
    "neighbours": [
      "GB-WR",
      "GB-SY",
      "GB-NP",
      "GB-LD",
      "GB-GL"
    ]
  },
  {
    "id": "GB-HP",
    "neighbours": [
      "GB-SL",
      "GB-RG",
      "GB-OX",
      "GB-MK",
      "GB-LU",
      "GB-AL",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-HG",
    "neighbours": [
      "GB-YO",
      "GB-LS",
      "GB-DL",
      "GB-BD"
    ]
  },
  {
    "id": "GB-HD",
    "neighbours": [
      "GB-WF",
      "GB-SK",
      "GB-S",
      "GB-OL",
      "GB-HX",
      "GB-BD"
    ]
  },
  {
    "id": "GB-GY",
    "neighbours": []
  },
  {
    "id": "GB-GU",
    "neighbours": [
      "GB-SO",
      "GB-SL",
      "GB-RH",
      "GB-RG",
      "GB-PO",
      "GB-KT",
      "GB-BN",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-GL",
    "neighbours": [
      "GB-WR",
      "GB-SN",
      "GB-OX",
      "GB-NP",
      "GB-HR",
      "GB-CV",
      "GB-BS",
      "GB-BA"
    ]
  },
  {
    "id": "GB-G",
    "neighbours": [
      "GB-ML",
      "GB-KA",
      "GB-FK"
    ]
  },
  {
    "id": "GB-FY",
    "neighbours": [
      "GB-PR"
    ]
  },
  {
    "id": "GB-FK",
    "neighbours": [
      "GB-PH",
      "GB-PA",
      "GB-ML",
      "GB-KY",
      "GB-G",
      "GB-EH"
    ]
  },
  {
    "id": "GB-EX",
    "neighbours": [
      "GB-TQ",
      "GB-TA",
      "GB-PL",
      "GB-DT"
    ]
  },
  {
    "id": "GB-EH",
    "neighbours": [
      "GB-TD",
      "GB-ML",
      "GB-KY",
      "GB-G",
      "GB-FK"
    ]
  },
  {
    "id": "GB-DY",
    "neighbours": [
      "GB-WV",
      "GB-WS",
      "GB-WR",
      "GB-SY",
      "GB-B"
    ]
  },
  {
    "id": "GB-DT",
    "neighbours": [
      "GB-TA",
      "GB-SP",
      "GB-EX",
      "GB-BH",
      "GB-BA"
    ]
  },
  {
    "id": "GB-DN",
    "neighbours": [
      "GB-YO",
      "GB-WF",
      "GB-S",
      "GB-NG",
      "GB-LS",
      "GB-LN",
      "GB-HU"
    ]
  },
  {
    "id": "GB-DL",
    "neighbours": [
      "GB-YO",
      "GB-TS",
      "GB-NE",
      "GB-LA",
      "GB-HG",
      "GB-DH",
      "GB-CA",
      "GB-BD"
    ]
  },
  {
    "id": "GB-DH",
    "neighbours": [
      "GB-TS",
      "GB-SR",
      "GB-NE",
      "GB-DL"
    ]
  },
  {
    "id": "GB-DG",
    "neighbours": [
      "GB-TD",
      "GB-NE",
      "GB-ML",
      "GB-KA",
      "GB-CA"
    ]
  },
  {
    "id": "GB-DE",
    "neighbours": [
      "GB-WS",
      "GB-ST",
      "GB-SK",
      "GB-S",
      "GB-NG",
      "GB-LE",
      "GB-CV",
      "GB-B"
    ]
  },
  {
    "id": "GB-DD",
    "neighbours": [
      "GB-PH",
      "GB-KY",
      "GB-AB"
    ]
  },
  {
    "id": "GB-CW",
    "neighbours": [
      "GB-WA",
      "GB-TF",
      "GB-SY",
      "GB-ST",
      "GB-SK",
      "GB-CH"
    ]
  },
  {
    "id": "GB-CV",
    "neighbours": [
      "GB-WR",
      "GB-OX",
      "GB-NN",
      "GB-LE",
      "GB-GL",
      "GB-DE",
      "GB-B"
    ]
  },
  {
    "id": "GB-CT",
    "neighbours": [
      "GB-TN",
      "GB-ME"
    ]
  },
  {
    "id": "GB-CO",
    "neighbours": [
      "GB-IP",
      "GB-CM",
      "GB-CB"
    ]
  },
  {
    "id": "GB-CM",
    "neighbours": [
      "GB-SS",
      "GB-SG",
      "GB-IG",
      "GB-CO",
      "GB-CB",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-CH",
    "neighbours": [
      "GB-WA",
      "GB-SY",
      "GB-LL",
      "GB-L",
      "GB-CW"
    ]
  },
  {
    "id": "GB-CF",
    "neighbours": [
      "GB-SA",
      "GB-NP",
      "GB-LD"
    ]
  },
  {
    "id": "GB-CB",
    "neighbours": [
      "GB-SG",
      "GB-PE",
      "GB-IP",
      "GB-CO",
      "GB-CM"
    ]
  },
  {
    "id": "GB-CA",
    "neighbours": [
      "GB-TD",
      "GB-NE",
      "GB-LA",
      "GB-DL",
      "GB-DG",
      "GB-BD"
    ]
  },
  {
    "id": "GB-BT",
    "neighbours": [
      "IR-XX"
    ]
  },
  {
    "id": "GB-BS",
    "neighbours": [
      "GB-TA",
      "GB-SN",
      "GB-NP",
      "GB-GL",
      "GB-BA"
    ]
  },
  {
    "id": "GB-BN",
    "neighbours": [
      "GB-TN",
      "GB-RH",
      "GB-PO",
      "GB-GU"
    ]
  },
  {
    "id": "GB-BL",
    "neighbours": [
      "GB-WN",
      "GB-PR",
      "GB-OL",
      "GB-M",
      "GB-BB"
    ]
  },
  {
    "id": "GB-BH",
    "neighbours": [
      "GB-SP",
      "GB-SO",
      "GB-DT"
    ]
  },
  {
    "id": "GB-BD",
    "neighbours": [
      "GB-WF",
      "GB-LS",
      "GB-LA",
      "GB-HX",
      "GB-HG",
      "GB-HD",
      "GB-DL",
      "GB-BB"
    ]
  },
  {
    "id": "GB-BB",
    "neighbours": [
      "GB-PR",
      "GB-OL",
      "GB-LA",
      "GB-HX",
      "GB-BL",
      "GB-BD"
    ]
  },
  {
    "id": "GB-BA",
    "neighbours": [
      "GB-TA",
      "GB-SP",
      "GB-SN",
      "GB-GL",
      "GB-DT",
      "GB-BS"
    ]
  },
  {
    "id": "GB-B",
    "neighbours": [
      "GB-WV",
      "GB-WS",
      "GB-WR",
      "GB-LE",
      "GB-DY",
      "GB-DE",
      "GB-CV"
    ]
  },
  {
    "id": "GB-AL",
    "neighbours": [
      "GB-SG",
      "GB-LU",
      "GB-HP",
      "GB-LONDON"
    ]
  },
  {
    "id": "GB-AB",
    "neighbours": [
      "GB-PH",
      "GB-IV",
      "GB-DD"
    ]
  },
  {
    "id": "GB-LONDON",
    "neighbours": [
      "GB-TN",
      "GB-SS",
      "GB-SL",
      "GB-SG",
      "GB-RH",
      "GB-RG",
      "GB-ME",
      "GB-KT",
      "GB-IG",
      "GB-HP",
      "GB-GU",
      "GB-CM",
      "GB-AL"
    ]
  },
  {
    "id": "DE-99",
    "neighbours": [
      "DE-98",
      "DE-38",
      "DE-37",
      "DE-36",
      "DE-07",
      "DE-06"
    ]
  },
  {
    "id": "DE-98",
    "neighbours": [
      "DE-99",
      "DE-97",
      "DE-96",
      "DE-36",
      "DE-07"
    ]
  },
  {
    "id": "DE-97",
    "neighbours": [
      "DE-98",
      "DE-96",
      "DE-91",
      "DE-74",
      "DE-69",
      "DE-64",
      "DE-63",
      "DE-36"
    ]
  },
  {
    "id": "DE-96",
    "neighbours": [
      "DE-98",
      "DE-97",
      "DE-95",
      "DE-91",
      "DE-07"
    ]
  },
  {
    "id": "DE-95",
    "neighbours": [
      "CZ-35",
      "DE-96",
      "DE-92",
      "DE-91",
      "DE-08",
      "DE-07"
    ]
  },
  {
    "id": "DE-94",
    "neighbours": [
      "CZ-38",
      "CZ-34",
      "CZ-33",
      "AT-52",
      "AT-51",
      "AT-49",
      "AT-47",
      "AT-41",
      "AT-00",
      "DE-93",
      "DE-92",
      "DE-84"
    ]
  },
  {
    "id": "DE-93",
    "neighbours": [
      "CZ-34",
      "CZ-33",
      "DE-94",
      "DE-92",
      "DE-85",
      "DE-84"
    ]
  },
  {
    "id": "DE-92",
    "neighbours": [
      "CZ-34",
      "DE-95",
      "DE-93",
      "DE-91",
      "DE-90",
      "DE-85"
    ]
  },
  {
    "id": "DE-91",
    "neighbours": [
      "DE-97",
      "DE-96",
      "DE-95",
      "DE-93",
      "DE-92",
      "DE-90",
      "DE-86",
      "DE-85",
      "DE-74",
      "DE-73"
    ]
  },
  {
    "id": "DE-90",
    "neighbours": [
      "DE-92",
      "DE-91"
    ]
  },
  {
    "id": "DE-89",
    "neighbours": [
      "DE-88",
      "DE-87",
      "DE-86",
      "DE-73",
      "DE-72",
      "DE-70"
    ]
  },
  {
    "id": "DE-88",
    "neighbours": [
      "CH-09",
      "CH-08",
      "AT-69",
      "AT-68",
      "DE-89",
      "DE-87",
      "DE-86",
      "DE-78",
      "DE-72"
    ]
  },
  {
    "id": "DE-87",
    "neighbours": [
      "AT-69",
      "AT-68",
      "AT-67",
      "AT-66",
      "DE-89",
      "DE-88",
      "DE-86",
      "DE-82"
    ]
  },
  {
    "id": "DE-86",
    "neighbours": [
      "AT-66",
      "DE-91",
      "DE-89",
      "DE-87",
      "DE-85",
      "DE-84",
      "DE-82",
      "DE-73"
    ]
  },
  {
    "id": "DE-85",
    "neighbours": [
      "DE-93",
      "DE-92",
      "DE-91",
      "DE-90",
      "DE-86",
      "DE-84",
      "DE-83",
      "DE-82",
      "DE-80-81"
    ]
  },
  {
    "id": "DE-84",
    "neighbours": [
      "AT-52",
      "AT-51",
      "AT-49",
      "DE-94",
      "DE-93",
      "DE-86",
      "DE-85",
      "DE-83"
    ]
  },
  {
    "id": "DE-83",
    "neighbours": [
      "AT-63",
      "AT-62",
      "AT-61",
      "AT-56",
      "AT-55",
      "AT-54",
      "AT-53",
      "AT-52",
      "AT-51",
      "AT-50",
      "DE-85",
      "DE-84",
      "DE-82"
    ]
  },
  {
    "id": "DE-82",
    "neighbours": [
      "AT-66",
      "AT-64",
      "AT-63",
      "AT-61",
      "AT-60",
      "DE-87",
      "DE-86",
      "DE-85",
      "DE-83",
      "DE-80-81"
    ]
  },
  {
    "id": "DE-80-81",
    "neighbours": [
      "DE-85",
      "DE-82"
    ]
  },
  {
    "id": "DE-79",
    "neighbours": [
      "CH-08",
      "CH-05",
      "CH-04",
      "FR-68",
      "FR-67",
      "DE-78",
      "DE-77"
    ]
  },
  {
    "id": "DE-78",
    "neighbours": [
      "CH-09",
      "CH-08",
      "CH-07",
      "DE-88",
      "DE-79",
      "DE-77",
      "DE-72"
    ]
  },
  {
    "id": "DE-77",
    "neighbours": [
      "FR-67",
      "DE-79",
      "DE-78",
      "DE-76",
      "DE-72"
    ]
  },
  {
    "id": "DE-76",
    "neighbours": [
      "FR-67",
      "DE-77",
      "DE-75",
      "DE-74",
      "DE-72",
      "DE-69",
      "DE-68",
      "DE-67",
      "DE-66"
    ]
  },
  {
    "id": "DE-75",
    "neighbours": [
      "DE-76",
      "DE-74",
      "DE-72",
      "DE-71"
    ]
  },
  {
    "id": "DE-74",
    "neighbours": [
      "DE-97",
      "DE-91",
      "DE-76",
      "DE-75",
      "DE-73",
      "DE-71",
      "DE-69",
      "DE-68",
      "DE-64",
      "DE-63"
    ]
  },
  {
    "id": "DE-73",
    "neighbours": [
      "DE-91",
      "DE-89",
      "DE-86",
      "DE-74",
      "DE-72",
      "DE-71",
      "DE-70"
    ]
  },
  {
    "id": "DE-72",
    "neighbours": [
      "DE-89",
      "DE-88",
      "DE-78",
      "DE-77",
      "DE-76",
      "DE-75",
      "DE-73",
      "DE-71",
      "DE-70"
    ]
  },
  {
    "id": "DE-71",
    "neighbours": [
      "DE-75",
      "DE-74",
      "DE-73",
      "DE-72",
      "DE-70"
    ]
  },
  {
    "id": "DE-70",
    "neighbours": [
      "DE-71"
    ]
  },
  {
    "id": "DE-69",
    "neighbours": [
      "DE-76",
      "DE-74",
      "DE-68",
      "DE-64",
      "DE-63"
    ]
  },
  {
    "id": "DE-68",
    "neighbours": [
      "DE-76",
      "DE-69",
      "DE-67",
      "DE-64"
    ]
  },
  {
    "id": "DE-67",
    "neighbours": [
      "DE-76",
      "DE-69",
      "DE-68",
      "DE-66",
      "DE-64",
      "DE-55"
    ]
  },
  {
    "id": "DE-66",
    "neighbours": [
      "LU-00",
      "FR-67",
      "FR-57",
      "DE-76",
      "DE-67",
      "DE-55",
      "DE-54"
    ]
  },
  {
    "id": "DE-65",
    "neighbours": [
      "DE-64",
      "DE-63",
      "DE-61",
      "DE-60",
      "DE-56",
      "DE-55",
      "DE-35"
    ]
  },
  {
    "id": "DE-64",
    "neighbours": [
      "DE-74",
      "DE-69",
      "DE-68",
      "DE-67",
      "DE-65",
      "DE-63",
      "DE-60",
      "DE-55"
    ]
  },
  {
    "id": "DE-63",
    "neighbours": [
      "DE-97",
      "DE-74",
      "DE-69",
      "DE-65",
      "DE-64",
      "DE-61",
      "DE-60",
      "DE-36",
      "DE-35"
    ]
  },
  {
    "id": "DE-61",
    "neighbours": [
      "DE-65",
      "DE-63",
      "DE-60",
      "DE-35"
    ]
  },
  {
    "id": "DE-60",
    "neighbours": [
      "DE-65",
      "DE-63",
      "DE-61"
    ]
  },
  {
    "id": "DE-59",
    "neighbours": [
      "DE-58",
      "DE-57",
      "DE-48",
      "DE-45",
      "DE-44",
      "DE-35",
      "DE-34",
      "DE-33"
    ]
  },
  {
    "id": "DE-58",
    "neighbours": [
      "DE-59",
      "DE-57",
      "DE-51",
      "DE-45",
      "DE-44",
      "DE-42"
    ]
  },
  {
    "id": "DE-57",
    "neighbours": [
      "DE-59",
      "DE-58",
      "DE-56",
      "DE-53",
      "DE-51",
      "DE-35",
      "DE-34"
    ]
  },
  {
    "id": "DE-56",
    "neighbours": [
      "DE-65",
      "DE-57",
      "DE-55",
      "DE-54",
      "DE-53",
      "DE-35"
    ]
  },
  {
    "id": "DE-55",
    "neighbours": [
      "DE-68",
      "DE-67",
      "DE-66",
      "DE-65",
      "DE-64",
      "DE-60",
      "DE-56",
      "DE-54"
    ]
  },
  {
    "id": "DE-54",
    "neighbours": [
      "LU-00",
      "FR-57",
      "DE-66",
      "DE-56",
      "DE-55",
      "DE-53",
      "BE-06",
      "BE-04"
    ]
  },
  {
    "id": "DE-53",
    "neighbours": [
      "DE-57",
      "DE-56",
      "DE-54",
      "DE-52",
      "DE-51",
      "DE-50",
      "BE-04"
    ]
  },
  {
    "id": "DE-52",
    "neighbours": [
      "NL-06",
      "DE-53",
      "DE-50",
      "DE-41",
      "BE-04",
      "BE-03"
    ]
  },
  {
    "id": "DE-51",
    "neighbours": [
      "DE-58",
      "DE-57",
      "DE-53",
      "DE-50",
      "DE-42",
      "DE-41",
      "DE-40"
    ]
  },
  {
    "id": "DE-50",
    "neighbours": [
      "DE-53",
      "DE-52",
      "DE-51",
      "DE-41",
      "DE-40"
    ]
  },
  {
    "id": "DE-49",
    "neighbours": [
      "NL-09",
      "NL-07",
      "DE-59",
      "DE-48",
      "DE-33",
      "DE-32",
      "DE-31",
      "DE-27",
      "DE-26"
    ]
  },
  {
    "id": "DE-48",
    "neighbours": [
      "NL-07",
      "DE-59",
      "DE-49",
      "DE-46",
      "DE-45",
      "DE-33"
    ]
  },
  {
    "id": "DE-47",
    "neighbours": [
      "NL-06",
      "NL-05",
      "DE-46",
      "DE-45",
      "DE-42",
      "DE-41",
      "DE-40"
    ]
  },
  {
    "id": "DE-46",
    "neighbours": [
      "NL-07",
      "NL-06",
      "DE-48",
      "DE-47",
      "DE-45"
    ]
  },
  {
    "id": "DE-45",
    "neighbours": [
      "DE-59",
      "DE-58",
      "DE-48",
      "DE-47",
      "DE-46",
      "DE-44",
      "DE-42",
      "DE-40"
    ]
  },
  {
    "id": "DE-44",
    "neighbours": [
      "DE-59",
      "DE-58",
      "DE-45"
    ]
  },
  {
    "id": "DE-42",
    "neighbours": [
      "DE-58",
      "DE-51",
      "DE-45",
      "DE-44",
      "DE-40"
    ]
  },
  {
    "id": "DE-41",
    "neighbours": [
      "NL-05",
      "DE-52",
      "DE-51",
      "DE-50",
      "DE-47",
      "DE-42",
      "DE-40"
    ]
  },
  {
    "id": "DE-40",
    "neighbours": [
      "DE-51",
      "DE-50",
      "DE-47",
      "DE-46",
      "DE-45",
      "DE-42",
      "DE-41"
    ]
  },
  {
    "id": "DE-39",
    "neighbours": [
      "DE-38",
      "DE-29",
      "DE-19",
      "DE-16",
      "DE-14",
      "DE-06"
    ]
  },
  {
    "id": "DE-38",
    "neighbours": [
      "DE-99",
      "DE-39",
      "DE-37",
      "DE-31",
      "DE-29",
      "DE-06"
    ]
  },
  {
    "id": "DE-37",
    "neighbours": [
      "DE-99",
      "DE-38",
      "DE-36",
      "DE-34",
      "DE-33",
      "DE-32",
      "DE-31"
    ]
  },
  {
    "id": "DE-36",
    "neighbours": [
      "DE-99",
      "DE-98",
      "DE-97",
      "DE-63",
      "DE-37",
      "DE-35",
      "DE-34"
    ]
  },
  {
    "id": "DE-35",
    "neighbours": [
      "DE-65",
      "DE-63",
      "DE-61",
      "DE-59",
      "DE-57",
      "DE-56",
      "DE-36",
      "DE-34"
    ]
  },
  {
    "id": "DE-34",
    "neighbours": [
      "DE-59",
      "DE-57",
      "DE-37",
      "DE-36",
      "DE-35",
      "DE-33",
      "DE-32"
    ]
  },
  {
    "id": "DE-33",
    "neighbours": [
      "DE-59",
      "DE-49",
      "DE-48",
      "DE-37",
      "DE-34",
      "DE-32"
    ]
  },
  {
    "id": "DE-32",
    "neighbours": [
      "DE-49",
      "DE-37",
      "DE-33",
      "DE-31",
      "DE-27"
    ]
  },
  {
    "id": "DE-31",
    "neighbours": [
      "DE-49",
      "DE-38",
      "DE-37",
      "DE-32",
      "DE-30",
      "DE-29",
      "DE-27"
    ]
  },
  {
    "id": "DE-30",
    "neighbours": [
      "DE-31",
      "DE-29"
    ]
  },
  {
    "id": "DE-29",
    "neighbours": [
      "DE-39",
      "DE-38",
      "DE-31",
      "DE-30",
      "DE-27",
      "DE-21",
      "DE-19",
      "DE-16"
    ]
  },
  {
    "id": "DE-28",
    "neighbours": [
      "DE-27"
    ]
  },
  {
    "id": "DE-27",
    "neighbours": [
      "DE-49",
      "DE-32",
      "DE-31",
      "DE-29",
      "DE-28",
      "DE-26",
      "DE-25",
      "DE-21"
    ]
  },
  {
    "id": "DE-26",
    "neighbours": [
      "NL-09",
      "DE-49",
      "DE-28",
      "DE-27"
    ]
  },
  {
    "id": "DE-25",
    "neighbours": [
      "DE-27",
      "DE-24",
      "DE-22",
      "DE-21",
      "DE-20",
      "DK-06"
    ]
  },
  {
    "id": "DE-24",
    "neighbours": [
      "DE-25",
      "DE-23",
      "DE-22",
      "DE-20",
      "DE-08",
      "DK-06"
    ]
  },
  {
    "id": "DE-23",
    "neighbours": [
      "DE-25",
      "DE-24",
      "DE-22",
      "DE-21",
      "DE-19"
    ]
  },
  {
    "id": "DE-22",
    "neighbours": [
      "DE-25",
      "DE-24",
      "DE-23",
      "DE-21",
      "DE-20"
    ]
  },
  {
    "id": "DE-21",
    "neighbours": [
      "DE-29",
      "DE-27",
      "DE-25",
      "DE-23",
      "DE-22",
      "DE-20",
      "DE-19"
    ]
  },
  {
    "id": "DE-20",
    "neighbours": [
      "DE-22"
    ]
  },
  {
    "id": "DE-19",
    "neighbours": [
      "DE-39",
      "DE-29",
      "DE-23",
      "DE-21",
      "DE-18",
      "DE-17",
      "DE-16",
      "DE-14"
    ]
  },
  {
    "id": "DE-18",
    "neighbours": [
      "DE-23",
      "DE-19",
      "DE-17"
    ]
  },
  {
    "id": "DE-17",
    "neighbours": [
      "PL-74",
      "PL-72",
      "PL-70-71",
      "DE-19",
      "DE-18",
      "DE-16"
    ]
  },
  {
    "id": "DE-16",
    "neighbours": [
      "PL-74",
      "PL-70-71",
      "DE-39",
      "DE-29",
      "DE-19",
      "DE-17",
      "DE-15",
      "DE-14",
      "DE-12-13",
      "DE-10"
    ]
  },
  {
    "id": "DE-15",
    "neighbours": [
      "PL-74",
      "PL-69",
      "PL-66",
      "DE-16",
      "DE-14",
      "DE-12-13",
      "DE-04",
      "DE-03"
    ]
  },
  {
    "id": "DE-14",
    "neighbours": [
      "DE-39",
      "DE-19",
      "DE-16",
      "DE-15",
      "DE-12-13",
      "DE-10",
      "DE-06"
    ]
  },
  {
    "id": "DE-12-13",
    "neighbours": [
      "DE-16",
      "DE-15",
      "DE-14",
      "DE-10"
    ]
  },
  {
    "id": "DE-10",
    "neighbours": [
      "DE-12-13"
    ]
  },
  {
    "id": "DE-09",
    "neighbours": [
      "CZ-43",
      "CZ-41",
      "CZ-36",
      "DE-08",
      "DE-04",
      "DE-01"
    ]
  },
  {
    "id": "DE-08",
    "neighbours": [
      "CZ-43",
      "CZ-36",
      "CZ-35",
      "DE-95",
      "DE-09",
      "DE-07",
      "DE-04"
    ]
  },
  {
    "id": "DE-07",
    "neighbours": [
      "DE-99",
      "DE-98",
      "DE-96",
      "DE-95",
      "DE-08",
      "DE-06",
      "DE-04"
    ]
  },
  {
    "id": "DE-06",
    "neighbours": [
      "DE-99",
      "DE-39",
      "DE-38",
      "DE-37",
      "DE-15",
      "DE-14",
      "DE-08",
      "DE-07",
      "DE-04"
    ]
  },
  {
    "id": "DE-04",
    "neighbours": [
      "DE-15",
      "DE-14",
      "DE-09",
      "DE-08",
      "DE-07",
      "DE-06",
      "DE-03",
      "DE-01"
    ]
  },
  {
    "id": "DE-03",
    "neighbours": [
      "PL-69",
      "PL-68",
      "PL-66",
      "DE-15",
      "DE-04",
      "DE-02",
      "DE-01"
    ]
  },
  {
    "id": "DE-02",
    "neighbours": [
      "CZ-47",
      "CZ-46",
      "CZ-40",
      "PL-68",
      "PL-59",
      "DE-03",
      "DE-01"
    ]
  },
  {
    "id": "DE-01",
    "neighbours": [
      "CZ-47",
      "CZ-43",
      "CZ-41",
      "CZ-40",
      "DE-09",
      "DE-04",
      "DE-03",
      "DE-02"
    ]
  },
  {
    "id": "DK-09",
    "neighbours": [
      "DK-08",
      "DK-07"
    ]
  },
  {
    "id": "DK-08",
    "neighbours": [
      "DK-09",
      "DK-07"
    ]
  },
  {
    "id": "DK-07",
    "neighbours": [
      "DK-09",
      "DK-08",
      "DK-06",
      "DK-05"
    ]
  },
  {
    "id": "DK-06",
    "neighbours": [
      "DE-25",
      "DE-24",
      "DK-07",
      "DK-05"
    ]
  },
  {
    "id": "DK-05",
    "neighbours": [
      "DK-07",
      "DK-06"
    ]
  },
  {
    "id": "DK-04",
    "neighbours": [
      "DK-03",
      "DK-02"
    ]
  },
  {
    "id": "DK-03",
    "neighbours": [
      "SE-27",
      "SE-26",
      "SE-25",
      "SE-24",
      "DK-04"
    ]
  },
  {
    "id": "DK-02",
    "neighbours": [
      "DK-04",
      "DK-03",
      "DK-01"
    ]
  },
  {
    "id": "DK-01",
    "neighbours": [
      "DK-02"
    ]
  },
  {
    "id": "BG-09",
    "neighbours": [
      "RO-90",
      "BG-08",
      "BG-07"
    ]
  },
  {
    "id": "BG-08",
    "neighbours": [
      "BG-09",
      "BG-07",
      "BG-06",
      "BG-05"
    ]
  },
  {
    "id": "BG-07",
    "neighbours": [
      "RO-91",
      "RO-90",
      "RO-14",
      "RO-08",
      "BG-09",
      "BG-08",
      "BG-05"
    ]
  },
  {
    "id": "BG-06",
    "neighbours": [
      "BG-08",
      "BG-05",
      "BG-04"
    ]
  },
  {
    "id": "BG-05",
    "neighbours": [
      "RO-23",
      "RO-20",
      "RO-14",
      "RO-08",
      "BG-08",
      "BG-07",
      "BG-06",
      "BG-04",
      "BG-03",
      "BG-02"
    ]
  },
  {
    "id": "BG-04",
    "neighbours": [
      "BG-06",
      "BG-05",
      "BG-02"
    ]
  },
  {
    "id": "BG-03",
    "neighbours": [
      "RS-19",
      "RS-18",
      "RO-23",
      "RO-22",
      "RO-20",
      "BG-05",
      "BG-02"
    ]
  },
  {
    "id": "BG-02",
    "neighbours": [
      "RS-18",
      "RS-17",
      "RS-16",
      "MK-24",
      "MK-23",
      "MK-22",
      "MK-13",
      "BG-05",
      "BG-04",
      "BG-03",
      "BG-01"
    ]
  },
  {
    "id": "BG-01",
    "neighbours": [
      "BG-02"
    ]
  },
  {
    "id": "BA-89",
    "neighbours": [
      "ME-85",
      "ME-81",
      "HR-02",
      "BA-88",
      "BA-73",
      "BA-71"
    ]
  },
  {
    "id": "BA-88",
    "neighbours": [
      "ME-81",
      "HR-02",
      "BA-89",
      "BA-80",
      "BA-72",
      "BA-71",
      "BA-70"
    ]
  }
]
';

-- Create temp table
DROP TABLE IF EXISTS #TMPREG;
CREATE TABLE #TMPREG (
    PathID NVARCHAR(50),
    Neighbour NVARCHAR(50)
);

-- Parse JSON and insert
INSERT INTO #TMPREG (PathID, Neighbour)
SELECT 
    main.id AS PathID,
    TRIM(neigh.value) AS Neighbour
FROM OPENJSON(@json)
WITH (
    id NVARCHAR(50),
    neighbours NVARCHAR(MAX) AS JSON
) AS main
CROSS APPLY OPENJSON(main.neighbours) AS neigh;

-- Truncate target table and insert
TRUNCATE TABLE dbo.svg_ctry_zip_EU_NB;

INSERT INTO dbo.svg_ctry_zip_EU_NB (Path_ID, Neighbour)
	SELECT PathID, Neighbour FROM #TMPREG;

