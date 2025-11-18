FactoryBot.define do
  factory :course do
    user { nil }
    title { "MyString" }
    description { "MyText" }
    language_code { "MyString" }
    level { "MyString" }
    status { "MyString" }
  end
end
